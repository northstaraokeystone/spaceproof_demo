/**
 * SpaceProof Receipt Chain
 *
 * CLAUDEME-compliant receipts:
 * - Dual-hash: SHA256:BLAKE3 format
 * - Merkle anchoring for batches
 * - Immutable audit trail
 *
 * LAW 1: No receipt → not real
 */

const ReceiptChain = {
  // In-memory ledger for demo
  ledger: [],

  // Receipt types
  RECEIPT_TYPES: {
    DEMO_LAUNCH: 'demo_launch_receipt',
    COMPONENT_VERIFICATION: 'component_verification_receipt',
    ORBITAL_VERIFICATION: 'orbital_verification_receipt',
    MODE_SWITCH: 'mode_switch_receipt',
    LOCATION_PROOF: 'location_proof_receipt',
    ARTIFACT_GENERATION: 'artifact_generation_receipt',
    BATCH_ANCHOR: 'batch_anchor_receipt'
  },

  /**
   * Dual hash: SHA256:BLAKE3 format
   * Using simulated hashes for browser demo
   */
  dualHash(data) {
    const str = typeof data === 'string' ? data : JSON.stringify(data, null, 0);
    const sha256 = this.sha256Sim(str);
    const blake3 = this.blake3Sim(str);
    return `${sha256}:${blake3}`;
  },

  /**
   * Simulated SHA256 (deterministic hash for demo)
   */
  sha256Sim(str) {
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h0 = (h0 ^ c) * 0x01000193;
      h1 = (h1 ^ (c >> 4)) * 0x01000193;
      h2 = (h2 ^ (c << 4)) * 0x01000193;
      h3 = (h3 ^ c) * 0x01000193;
    }
    return ((h0 >>> 0).toString(16).padStart(8, '0') +
            (h1 >>> 0).toString(16).padStart(8, '0') +
            (h2 >>> 0).toString(16).padStart(8, '0') +
            (h3 >>> 0).toString(16).padStart(8, '0')).substring(0, 16);
  },

  /**
   * Simulated BLAKE3 (different deterministic hash for demo)
   */
  blake3Sim(str) {
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h0 = ((h0 << 5) - h0 + c) >>> 0;
      h1 = ((h1 << 7) - h1 + (c >> 2)) >>> 0;
      h2 = ((h2 << 11) - h2 + (c << 2)) >>> 0;
      h3 = ((h3 << 13) - h3 + c) >>> 0;
    }
    return ((h0 >>> 0).toString(16).padStart(8, '0') +
            (h1 >>> 0).toString(16).padStart(8, '0') +
            (h2 >>> 0).toString(16).padStart(8, '0') +
            (h3 >>> 0).toString(16).padStart(8, '0')).substring(0, 16);
  },

  /**
   * Emit a receipt and add to ledger
   */
  emitReceipt(receiptType, payload) {
    const receipt = {
      receipt_type: receiptType,
      ts: new Date().toISOString(),
      tenant_id: 'spaceproof_demo',
      payload: payload,
      payload_hash: this.dualHash(payload)
    };

    // Add chain reference
    if (this.ledger.length > 0) {
      receipt.prev_hash = this.ledger[this.ledger.length - 1].payload_hash;
    } else {
      receipt.prev_hash = 'GENESIS';
    }

    this.ledger.push(receipt);

    // Log to console for debugging
    console.log('[RECEIPT]', JSON.stringify(receipt));

    return receipt;
  },

  /**
   * Emit component verification receipt
   */
  emitVerificationReceipt(verificationResult) {
    return this.emitReceipt(this.RECEIPT_TYPES.COMPONENT_VERIFICATION, {
      component_id: verificationResult.component_id,
      component_type: verificationResult.component_type,
      mode: verificationResult.mode,
      entropy: verificationResult.entropy.measured,
      entropy_noise: verificationResult.entropy.noise_floor,
      threshold: verificationResult.threshold,
      is_genuine: verificationResult.is_genuine,
      confidence: verificationResult.confidence,
      thermal_baseline: verificationResult.thermal_baseline,
      verification_time_ms: verificationResult.verification_time_ms
    });
  },

  /**
   * Emit orbital verification receipt (enhanced)
   */
  emitOrbitalVerificationReceipt(terrestrialResult, orbitalResult, locationProof) {
    return this.emitReceipt(this.RECEIPT_TYPES.ORBITAL_VERIFICATION, {
      component_id: orbitalResult.component_id,
      entropy_terrestrial: terrestrialResult.entropy.measured,
      entropy_orbital: orbitalResult.entropy.measured,
      confidence_terrestrial: terrestrialResult.confidence,
      confidence_orbital: orbitalResult.confidence,
      orbital_node: locationProof.ephemeris.node_id,
      kepler_signature: locationProof.response,
      tee_attestation: locationProof.tee_attestation.hardware_id,
      latency_ms: locationProof.actual_latency_ms,
      improvement: {
        confidence_delta: (orbitalResult.confidence - terrestrialResult.confidence).toFixed(3),
        noise_reduction: `${terrestrialResult.entropy.noise_floor} → ${orbitalResult.entropy.noise_floor}`
      }
    });
  },

  /**
   * Emit mode switch receipt
   */
  emitModeSwitchReceipt(fromMode, toMode, nodeInfo) {
    return this.emitReceipt(this.RECEIPT_TYPES.MODE_SWITCH, {
      from_mode: fromMode,
      to_mode: toMode,
      node_id: nodeInfo.node_id || 'N/A',
      altitude_km: nodeInfo.altitude_km || 0,
      thermal_baseline: toMode === 'orbital' ? '-270°C' : '25°C',
      latency_ms: nodeInfo.latency_ms || 0
    });
  },

  /**
   * Emit location proof receipt
   */
  emitLocationProofReceipt(proof) {
    return this.emitReceipt(this.RECEIPT_TYPES.LOCATION_PROOF, {
      challenge: proof.challenge,
      response: proof.response,
      altitude_km: proof.altitude_km,
      latency_ms: proof.actual_latency_ms,
      latency_valid: proof.latency_valid,
      tee_attestation: proof.tee_attestation,
      ephemeris: proof.ephemeris,
      verified: proof.verified
    });
  },

  /**
   * Emit artifact generation receipt
   */
  emitArtifactReceipt(artifactData) {
    return this.emitReceipt(this.RECEIPT_TYPES.ARTIFACT_GENERATION, {
      artifact_type: artifactData.type,
      component_id: artifactData.component_id,
      verification_mode: artifactData.mode,
      confidence: artifactData.confidence,
      roi_value: artifactData.roi_value,
      merkle_root: this.computeMerkleRoot(),
      receipt_count: this.ledger.length
    });
  },

  /**
   * Compute Merkle root of current ledger
   */
  computeMerkleRoot() {
    if (this.ledger.length === 0) {
      return this.dualHash('empty');
    }

    let hashes = this.ledger.map(r => r.payload_hash);

    while (hashes.length > 1) {
      if (hashes.length % 2 !== 0) {
        hashes.push(hashes[hashes.length - 1]);
      }

      const nextLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        nextLevel.push(this.dualHash(hashes[i] + hashes[i + 1]));
      }
      hashes = nextLevel;
    }

    return hashes[0];
  },

  /**
   * Anchor current batch
   */
  anchorBatch() {
    const merkleRoot = this.computeMerkleRoot();
    return this.emitReceipt(this.RECEIPT_TYPES.BATCH_ANCHOR, {
      merkle_root: merkleRoot,
      batch_size: this.ledger.length,
      hash_algorithms: ['SHA256', 'BLAKE3'],
      anchor_timestamp: new Date().toISOString()
    });
  },

  /**
   * Verify chain integrity
   */
  verifyChain() {
    for (let i = 1; i < this.ledger.length; i++) {
      const current = this.ledger[i];
      const previous = this.ledger[i - 1];

      if (current.prev_hash !== previous.payload_hash) {
        return {
          valid: false,
          error: `Chain break at index ${i}`,
          expected: previous.payload_hash,
          found: current.prev_hash
        };
      }
    }

    return {
      valid: true,
      length: this.ledger.length,
      merkle_root: this.computeMerkleRoot()
    };
  },

  /**
   * Get ledger statistics
   */
  getStats() {
    const byType = {};
    for (const receipt of this.ledger) {
      byType[receipt.receipt_type] = (byType[receipt.receipt_type] || 0) + 1;
    }

    return {
      total_receipts: this.ledger.length,
      by_type: byType,
      merkle_root: this.computeMerkleRoot(),
      chain_valid: this.verifyChain().valid
    };
  },

  /**
   * Export ledger as JSONL
   */
  exportLedger() {
    return this.ledger.map(r => JSON.stringify(r)).join('\n');
  },

  /**
   * Reset ledger (for demo restart)
   */
  reset() {
    this.ledger = [];
    console.log('[RECEIPT_CHAIN] Ledger reset');
  },

  /**
   * Get formatted receipt for display
   */
  formatReceiptForDisplay(receipt) {
    return {
      type: receipt.receipt_type,
      timestamp: receipt.ts,
      hash: receipt.payload_hash.substring(0, 24) + '...',
      chain_link: receipt.prev_hash === 'GENESIS' ? 'GENESIS' : receipt.prev_hash.substring(0, 12) + '...'
    };
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReceiptChain;
}
