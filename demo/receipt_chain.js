/**
 * SpaceProof Receipt Chain
 * Dual-hash (SHA256:BLAKE3) receipts with Merkle anchoring
 * CLAUDEME compliant: No receipt -> not real
 */

const ReceiptChain = {
    receipts: [],
    merkleRoots: [],

    /**
     * Compute dual hash (SHA256:BLAKE3 format)
     * In browser, we simulate BLAKE3 with a secondary SHA256 pass
     * @param {string|Object} data - Data to hash
     * @returns {string} Dual hash in format sha256:blake3
     */
    async dualHash(data) {
        const str = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(str);

        // SHA256
        const sha256Buffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const sha256 = Array.from(new Uint8Array(sha256Buffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');

        // Simulate BLAKE3 with SHA256 of SHA256 (for demo purposes)
        // In production, use actual BLAKE3 library
        const blake3Buffer = await crypto.subtle.digest('SHA-256', sha256Buffer);
        const blake3 = Array.from(new Uint8Array(blake3Buffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');

        return `${sha256.substring(0, 16)}:${blake3.substring(0, 16)}`;
    },

    /**
     * Emit a receipt (CLAUDEME LAW_1)
     * @param {string} receiptType - Type of receipt
     * @param {Object} data - Receipt payload
     * @returns {Object} The emitted receipt
     */
    async emitReceipt(receiptType, data) {
        const payload = { ...data };
        const payloadHash = await this.dualHash(payload);

        const receipt = {
            receipt_type: receiptType,
            ts: new Date().toISOString(),
            tenant_id: 'spaceproof-demo',
            payload: payload,
            payload_hash: payloadHash
        };

        this.receipts.push(receipt);
        this.updateReceiptCount();

        return receipt;
    },

    /**
     * Emit orbital verification receipt
     * @param {Object} verificationResult - Result from entropy engine
     * @returns {Object} The verification receipt
     */
    async emitVerificationReceipt(verificationResult) {
        return await this.emitReceipt('orbital_verification', {
            component_id: verificationResult.component_id,
            component_type: verificationResult.component_type,
            entropy_terrestrial: verificationResult.terrestrial.entropy,
            entropy_orbital: verificationResult.orbital.entropy,
            confidence_terrestrial: verificationResult.terrestrial.confidence,
            confidence_orbital: verificationResult.orbital.confidence,
            noise_terrestrial: verificationResult.terrestrial.noise_floor,
            noise_orbital: verificationResult.orbital.noise_floor,
            verdict: verificationResult.verdict,
            thermal_baseline_orbital: verificationResult.orbital.thermal_baseline
        });
    },

    /**
     * Emit location proof receipt
     * @param {Object} locationProof - Location verification data
     * @returns {Object} The location proof receipt
     */
    async emitLocationProofReceipt(locationProof) {
        return await this.emitReceipt('location_proof', {
            node_id: locationProof.node_id,
            challenge: locationProof.challenge,
            response: locationProof.response,
            kepler_signature: locationProof.kepler_signature,
            light_delay_ms: locationProof.light_delay_ms,
            altitude_km: locationProof.altitude_km,
            tee_attestation: locationProof.tee_attestation,
            verification_status: locationProof.status
        });
    },

    /**
     * Emit artifact generation receipt
     * @param {Object} artifact - Generated artifact data
     * @returns {Object} The artifact receipt
     */
    async emitArtifactReceipt(artifact) {
        return await this.emitReceipt('artifact_generation', {
            artifact_type: artifact.type,
            component_id: artifact.component_id,
            verification_summary: artifact.summary,
            roi_calculation: artifact.roi,
            receipt_chain_length: this.receipts.length
        });
    },

    /**
     * Compute Merkle root of receipt chain
     * @param {Object[]} items - Items to compute root for
     * @returns {string} Merkle root hash
     */
    async computeMerkleRoot(items = null) {
        const receiptList = items || this.receipts;
        if (receiptList.length === 0) {
            return await this.dualHash('empty');
        }

        let hashes = await Promise.all(
            receiptList.map(r => this.dualHash(r))
        );

        while (hashes.length > 1) {
            if (hashes.length % 2 === 1) {
                hashes.push(hashes[hashes.length - 1]);
            }
            const newHashes = [];
            for (let i = 0; i < hashes.length; i += 2) {
                const combined = await this.dualHash(hashes[i] + hashes[i + 1]);
                newHashes.push(combined);
            }
            hashes = newHashes;
        }

        return hashes[0];
    },

    /**
     * Anchor current receipts with Merkle root
     * @returns {Object} Anchor receipt
     */
    async anchorReceipts() {
        const merkleRoot = await this.computeMerkleRoot();
        this.merkleRoots.push({
            root: merkleRoot,
            batch_size: this.receipts.length,
            ts: new Date().toISOString()
        });

        return await this.emitReceipt('anchor', {
            merkle_root: merkleRoot,
            hash_algos: ['SHA256', 'BLAKE3'],
            batch_size: this.receipts.length
        });
    },

    /**
     * Verify receipt chain integrity
     * @returns {Object} Verification result
     */
    async verifyChain() {
        if (this.receipts.length === 0) {
            return { valid: true, message: 'Empty chain' };
        }

        // Verify each receipt hash
        for (const receipt of this.receipts) {
            const computed = await this.dualHash(receipt.payload);
            if (computed !== receipt.payload_hash) {
                return {
                    valid: false,
                    message: `Hash mismatch at receipt ${receipt.ts}`,
                    receipt: receipt
                };
            }
        }

        return {
            valid: true,
            message: 'Chain integrity verified',
            receipt_count: this.receipts.length,
            merkle_root: await this.computeMerkleRoot()
        };
    },

    /**
     * Get chain statistics
     * @returns {Object} Chain statistics
     */
    getChainStats() {
        const byType = {};
        for (const r of this.receipts) {
            byType[r.receipt_type] = (byType[r.receipt_type] || 0) + 1;
        }

        return {
            total_receipts: this.receipts.length,
            by_type: byType,
            anchor_count: this.merkleRoots.length,
            last_receipt: this.receipts.length > 0
                ? this.receipts[this.receipts.length - 1].ts
                : null
        };
    },

    /**
     * Clear chain (for demo reset)
     */
    clear() {
        this.receipts = [];
        this.merkleRoots = [];
        this.updateReceiptCount();
    },

    /**
     * Update UI receipt counter
     */
    updateReceiptCount() {
        const counter = document.getElementById('receipt-count');
        if (counter) {
            counter.textContent = this.receipts.length;
        }
    },

    /**
     * Export receipts as JSONL
     * @returns {string} JSONL formatted receipts
     */
    exportJSONL() {
        return this.receipts.map(r => JSON.stringify(r)).join('\n');
    }
};

// Export for use in demo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReceiptChain;
}
