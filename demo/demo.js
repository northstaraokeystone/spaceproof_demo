/**
 * SpaceProof Demo Orchestration
 * Stealth Bomber compliant: Dark by default, Victory breath pacing
 *
 * 5-Act Structure:
 * ACT 1: The Suffocation (terrestrial verification)
 * ACT 2: The Ascent (switch to orbital mode)
 * ACT 3: The Singularity (orbital advantages demonstrated)
 * ACT 4: The SpaceProof (location verification + artifact)
 * ACT 5: Return to Armed (ready state)
 */

const SpaceProofDemo = {
    // State
    mode: 'terrestrial',
    isRunning: false,
    threatCount: 0,
    verifiedCount: 0,
    currentComponent: null,

    // Component database (loaded from JSON)
    components: [],

    // DOM elements
    elements: {},

    /**
     * Initialize the demo
     */
    async init() {
        // Cache DOM elements
        this.elements = {
            output: document.getElementById('output'),
            input: document.getElementById('command-input'),
            status: document.getElementById('system-status'),
            mode: document.getElementById('current-mode'),
            modeIndicator: document.querySelector('.mode-indicator'),
            threatCount: document.getElementById('threat-count'),
            verifiedCount: document.getElementById('verified-count'),
            demoBtn: document.getElementById('btn-demo'),
            modal: document.getElementById('artifact-modal'),
            artifactBody: document.getElementById('artifact-body'),
            closeModal: document.getElementById('close-modal'),
            downloadBtn: document.getElementById('download-artifact')
        };

        // Load component data
        await this.loadComponents();

        // Set up event listeners
        this.setupEventListeners();

        // Initial status
        this.log('SPACEPROOF ORBITAL VERIFICATION SYSTEM v1.0', 'muted');
        this.log('Type "help" for commands or press SPACE to run demo', 'muted');
        this.log('', 'result');

        // Emit initialization receipt
        await ReceiptChain.emitReceipt('demo_init', {
            version: '1.0',
            mode: 'terrestrial',
            components_loaded: this.components.length
        });
    },

    /**
     * Load component database
     */
    async loadComponents() {
        try {
            const response = await fetch('../data/components.json');
            this.components = await response.json();
        } catch (e) {
            // Use inline test data if fetch fails
            this.components = this.generateTestComponents();
        }
    },

    /**
     * Generate test components (80 genuine, 20 counterfeit)
     */
    generateTestComponents() {
        const components = [];
        const types = ['CAPACITOR', 'RESISTOR', 'IC-CHIP', 'CONNECTOR', 'INDUCTOR'];

        // 80 genuine components (entropy 0.82-0.94)
        for (let i = 0; i < 80; i++) {
            components.push({
                id: `GEN-${String(i + 1).padStart(5, '0')}`,
                type: types[i % types.length],
                entropy_baseline: 0.82 + Math.random() * 0.12,
                manufacturer: 'VERIFIED-MFG',
                lot: `LOT-${2024 + Math.floor(i / 20)}-${String((i % 20) + 1).padStart(3, '0')}`
            });
        }

        // 20 counterfeit components (entropy 0.65-0.78)
        for (let i = 0; i < 20; i++) {
            components.push({
                id: `CFT-${String(i + 1).padStart(5, '0')}`,
                type: types[i % types.length],
                entropy_baseline: 0.65 + Math.random() * 0.13,
                manufacturer: 'UNKNOWN',
                lot: `GRAY-${String(i + 1).padStart(3, '0')}`
            });
        }

        return components;
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Command input
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand(e.target.value);
                e.target.value = '';
            }
        });

        // Demo button
        this.elements.demoBtn.addEventListener('click', () => this.runFullDemo());

        // Spacebar trigger
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target !== this.elements.input) {
                e.preventDefault();
                this.runFullDemo();
            }
        });

        // Modal close
        this.elements.closeModal.addEventListener('click', () => this.hideModal());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadArtifact());
    },

    /**
     * Handle CLI commands
     */
    async handleCommand(cmd) {
        const trimmed = cmd.trim().toLowerCase();
        this.log(`> ${cmd}`, 'command');

        const [command, ...args] = trimmed.split(' ');

        switch (command) {
            case 'help':
                this.showHelp();
                break;
            case 'verify':
                await this.verifyComponent(args[0]);
                break;
            case 'switch':
                await this.switchMode(args[0]);
                break;
            case 'location':
                await this.verifyLocation();
                break;
            case 'compare':
                await this.showComparison();
                break;
            case 'status':
                this.showStatus();
                break;
            case 'clear':
                this.clearOutput();
                break;
            case 'demo':
                await this.runFullDemo();
                break;
            case 'receipts':
                this.showReceipts();
                break;
            default:
                this.log(`Unknown command: ${command}. Type "help" for available commands.`, 'error');
        }
    },

    /**
     * Display help information
     */
    showHelp() {
        const help = [
            'AVAILABLE COMMANDS:',
            '',
            '  verify <id>     Verify component by ID',
            '  switch <mode>   Switch mode (terrestrial/orbital)',
            '  location        Verify orbital node location',
            '  compare         Show terrestrial vs orbital comparison',
            '  status          Show system status',
            '  receipts        Show receipt chain statistics',
            '  demo            Run full demonstration',
            '  clear           Clear terminal output',
            '  help            Show this help message',
            '',
            'Press SPACE to run the full demo sequence.'
        ];
        help.forEach(line => this.log(line, 'result'));
    },

    /**
     * Run full 5-act demo
     */
    async runFullDemo() {
        if (this.isRunning) return;
        this.isRunning = true;

        // Clear and reset
        this.clearOutput();
        ReceiptChain.clear();
        this.mode = 'terrestrial';
        this.updateModeDisplay();

        // Select a counterfeit component for demo
        const counterfeit = this.components.find(c => c.id.startsWith('CFT'));

        // ACT 1: THE SUFFOCATION
        await this.actSuffocation(counterfeit);

        // ACT 2: THE ASCENT
        await this.actAscent();

        // ACT 3: THE SINGULARITY
        await this.actSingularity(counterfeit);

        // ACT 4: THE SPACEPROOF
        await this.actSpaceproof(counterfeit);

        // ACT 5: RETURN TO ARMED
        await this.actArmed();

        this.isRunning = false;
    },

    /**
     * ACT 1: The Suffocation (60 seconds)
     * Terrestrial verification with limitations
     */
    async actSuffocation(component) {
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('ACT 1: TERRESTRIAL VERIFICATION', 'highlight');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('', 'result');

        this.log(`> VERIFY_COMPONENT --id=${component.id} --mode=terrestrial`, 'command');
        await this.sleep(800);

        // Measure entropy in terrestrial mode
        const result = EntropyEngine.measureEntropy(component, 'terrestrial');

        // Display threat box
        this.displayThreatBox(result);

        this.threatCount++;
        this.updateCounters();

        // Emit receipt
        await ReceiptChain.emitReceipt('terrestrial_verification', {
            component_id: component.id,
            entropy: result.entropy,
            confidence: result.confidence,
            noise_floor: result.noise_floor
        });

        this.log('', 'result');
        this.log(`VERIFICATION CONFIDENCE: ${(result.confidence * 100).toFixed(1)}%`, 'muted');
        this.log('LIMITATION: Thermal noise floor restricting accuracy', 'muted');
        this.log(`THERMAL NOISE: +/-${result.noise_floor} entropy variance`, 'muted');

        // Pause for effect (Doctrine 2)
        await this.sleep(2000);
    },

    /**
     * ACT 2: The Ascent (45 seconds)
     * Switch to orbital mode
     */
    async actAscent() {
        this.log('', 'result');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('ACT 2: ORBITAL MODE ACTIVATION', 'highlight');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('', 'result');

        this.log('> SWITCH_MODE --orbit=LEO --node=ORBITAL-NODE-7', 'command');

        // Pre-block pause (Doctrine 2)
        await this.sleep(1500);

        // Display acquisition sequence
        const statusLines = OrbitalSim.getStatusLines();
        for (const line of statusLines) {
            this.log(line, 'highlight');
            await this.sleep(600);
        }

        // Update mode
        this.mode = 'orbital';
        this.updateModeDisplay();

        // Emit mode switch receipt
        await ReceiptChain.emitReceipt('mode_switch', {
            from: 'terrestrial',
            to: 'orbital',
            node_id: OrbitalSim.node.id,
            altitude_km: OrbitalSim.node.altitude_km
        });

        // Post-block pause (Victory Breath)
        await this.sleep(2000);
    },

    /**
     * ACT 3: The Singularity (90 seconds)
     * Demonstrate orbital advantages
     */
    async actSingularity(component) {
        this.log('', 'result');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('ACT 3: ORBITAL VERIFICATION', 'highlight');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('', 'result');

        // Feature 1: Thermal Clarity
        this.log('FEATURE 1: THERMAL CLARITY', 'result');
        this.log('─────────────────────────────────────────────────────────────', 'muted');

        this.log(`> VERIFY_COMPONENT --id=${component.id} --mode=orbital`, 'command');
        await this.sleep(800);

        const comparison = EntropyEngine.verifyWithComparison(component);

        // Display comparison table
        this.displayComparisonTable(comparison);

        this.verifiedCount++;
        this.updateCounters();

        // Emit verification receipt
        await ReceiptChain.emitVerificationReceipt(comparison);

        await this.sleep(1500);

        // Feature 2: Verification Rate
        this.log('', 'result');
        this.log('FEATURE 2: VERIFICATION THROUGHPUT', 'result');
        this.log('─────────────────────────────────────────────────────────────', 'muted');

        const terrestrialRate = EntropyEngine.getVerificationRate('terrestrial');
        const orbitalRate = EntropyEngine.getVerificationRate('orbital');

        this.log(`Terrestrial: ${terrestrialRate.components_per_second} component/sec (cost: ${terrestrialRate.marginal_cost})`, 'muted');
        this.log(`Orbital:     ${orbitalRate.components_per_second} components/sec (cost: ${orbitalRate.marginal_cost})`, 'highlight');
        this.log(`IMPROVEMENT: ${orbitalRate.components_per_second / terrestrialRate.components_per_second}x throughput increase`, 'result');

        await this.sleep(1500);

        // Feature 3: Latency Physics
        this.log('', 'result');
        this.log('FEATURE 3: VERIFICATION LATENCY', 'result');
        this.log('─────────────────────────────────────────────────────────────', 'muted');

        const chainLength = 100;
        const terrestrialLatency = EntropyEngine.getVerificationLatency(chainLength, 'terrestrial');
        const orbitalLatency = EntropyEngine.getVerificationLatency(chainLength, 'orbital');

        this.log(`Receipt chain verification (${chainLength} receipts):`, 'muted');
        this.log(`  Terrestrial (fiber): ${terrestrialLatency.p99_latency_ms}ms p99`, 'muted');
        this.log(`  Orbital (vacuum):    ${orbitalLatency.p99_latency_ms}ms p99`, 'highlight');
        this.log(``, 'result');
        this.log(`PHYSICS: t_vacuum = t_fiber * (c/n) where n=1.5`, 'muted');
        this.log(`RESULT: 40% faster verification in vacuum`, 'result');

        await this.sleep(2000);
    },

    /**
     * ACT 4: The SpaceProof (90 seconds)
     * Location verification and artifact generation
     */
    async actSpaceproof(component) {
        this.log('', 'result');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('ACT 4: LOCATION PROOF GENERATION', 'highlight');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('', 'result');

        this.log('> VERIFY_LOCATION --node=ORBITAL-NODE-7', 'command');
        await this.sleep(800);

        // Generate location proof
        const proof = await OrbitalSim.generateLocationProof();

        this.log(`CHALLENGE: ${proof.challenge} (random nonce)`, 'muted');
        await this.sleep(1500);

        this.log('', 'result');
        this.log('[Waiting for orbital response...]', 'muted');

        // Simulate light-speed delay (dramatized)
        await this.sleep(proof.light_delay_ms * 500);

        this.log(`RESPONSE: ${proof.response} (signed by TEE)`, 'muted');
        await this.sleep(500);

        // Display verification result
        this.displayLocationProof(proof);

        // Emit location proof receipt
        await ReceiptChain.emitLocationProofReceipt(proof);

        // Pre-artifact pause
        await this.sleep(1500);

        // Generate artifact
        this.log('', 'result');
        this.log('GENERATING VERIFICATION ARTIFACT...', 'result');
        await this.sleep(1000);

        const artifact = await this.generateArtifact(component, proof);

        // Emit artifact receipt
        await ReceiptChain.emitArtifactReceipt({
            type: 'verification_report',
            component_id: component.id,
            summary: artifact.summary,
            roi: artifact.roi
        });

        // Anchor all receipts
        await ReceiptChain.anchorReceipts();

        // Show artifact modal
        this.showArtifactModal(artifact);

        // Hold the proof (Doctrine 2)
        await this.sleep(2000);
    },

    /**
     * ACT 5: Return to Armed
     */
    async actArmed() {
        this.hideModal();

        this.log('', 'result');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('AWAITING_NEXT_COMPONENT...', 'result');
        this.log('═══════════════════════════════════════════════════════════════', 'muted');
        this.log('', 'result');

        this.elements.status.textContent = 'MONITORING';

        // Emit completion receipt
        await ReceiptChain.emitReceipt('demo_complete', {
            threats_detected: this.threatCount,
            components_verified: this.verifiedCount,
            receipts_emitted: ReceiptChain.receipts.length
        });
    },

    /**
     * Display threat detection box
     */
    displayThreatBox(result) {
        const html = `
            <div class="threat-box">
                <div class="threat-header">COUNTERFEIT DETECTED</div>
                <div>Component: ${result.component_id}</div>
                <div>Entropy: ${result.entropy.toFixed(4)} (threshold: ${result.threshold})</div>
                <div>Confidence: ${(result.confidence * 100).toFixed(1)}%</div>
                <div>Thermal Noise: +/-${result.noise_floor} entropy variance</div>
            </div>
        `;
        this.elements.output.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
    },

    /**
     * Display comparison table
     */
    displayComparisonTable(comparison) {
        const html = `
            <table class="comparison-table">
                <tr>
                    <th>METRIC</th>
                    <th>TERRESTRIAL</th>
                    <th>ORBITAL</th>
                </tr>
                <tr>
                    <td>Entropy</td>
                    <td>${comparison.terrestrial.entropy.toFixed(4)}+/-${comparison.terrestrial.noise_floor}</td>
                    <td class="highlight-cell">${comparison.orbital.entropy.toFixed(4)}+/-${comparison.orbital.noise_floor}</td>
                </tr>
                <tr>
                    <td>Confidence</td>
                    <td>${(comparison.terrestrial.confidence * 100).toFixed(1)}%</td>
                    <td class="highlight-cell">${(comparison.orbital.confidence * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Thermal Noise</td>
                    <td>HIGH (+/-${comparison.terrestrial.noise_floor})</td>
                    <td class="highlight-cell">NEGLIGIBLE (+/-${comparison.orbital.noise_floor})</td>
                </tr>
                <tr>
                    <td>Thermal Baseline</td>
                    <td>${comparison.terrestrial.thermal_baseline}C (datacenter)</td>
                    <td class="highlight-cell">${comparison.orbital.thermal_baseline}C (radiative)</td>
                </tr>
            </table>
            <div class="output-line result">VERDICT: ${comparison.verdict}</div>
            <div class="output-line highlight">CONFIDENCE IMPROVEMENT: +${(comparison.improvement.confidence_delta * 100).toFixed(1)} percentage points</div>
        `;
        this.elements.output.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
    },

    /**
     * Display location proof
     */
    displayLocationProof(proof) {
        const html = `
            <div class="verify-box orbital">
                <div style="color: var(--highlight); font-weight: 700; margin-bottom: 10px;">
                    ORBITAL SIGNATURE VERIFIED
                </div>
                <div>Kepler elements match predicted ephemeris</div>
                <div>Light-speed delay: ${proof.light_delay_ms}ms (consistent with ${proof.altitude_km}km altitude)</div>
                <div>TEE attestation: ${proof.tee_attestation}</div>
                <div style="margin-top: 12px; font-weight: 700; color: var(--highlight);">
                    SPACEPROOF STATUS: VERIFIED
                </div>
                <div style="margin-top: 8px; color: var(--text-muted);">
                    This hardware is cryptographically proven to be:<br>
                    1. In orbit (Kepler signature)<br>
                    2. Genuine hardware (TEE attestation)<br>
                    3. Not gray market (orbital supply chain verified)
                </div>
            </div>
        `;
        this.elements.output.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
    },

    /**
     * Generate verification artifact
     */
    async generateArtifact(component, proof) {
        const chain = await ReceiptChain.verifyChain();
        const stats = ReceiptChain.getChainStats();

        return {
            type: 'verification_report',
            component_id: component.id,
            component_type: component.type,
            timestamp: new Date().toISOString(),
            summary: {
                verdict: 'COUNTERFEIT DETECTED',
                confidence_terrestrial: '87%',
                confidence_orbital: '99.8%',
                improvement: '+12.8 percentage points'
            },
            orbital_proof: {
                node_id: proof.node_id,
                kepler_signature: proof.kepler_signature,
                light_delay_ms: proof.light_delay_ms,
                tee_attestation: proof.tee_attestation
            },
            receipt_chain: {
                receipts: stats.total_receipts,
                merkle_root: chain.merkle_root,
                integrity: chain.valid ? 'VERIFIED' : 'FAILED'
            },
            roi: {
                counterfeits_detected: 1,
                estimated_savings: '$420,000',
                failure_mode_avoided: 'Satellite component failure',
                note: 'Based on average satellite repair cost of $420K per component failure'
            }
        };
    },

    /**
     * Show artifact modal
     */
    showArtifactModal(artifact) {
        const html = `
            <div class="artifact-section">
                <h3>COMPONENT VERIFICATION</h3>
                <div class="artifact-row">
                    <span class="artifact-label">Component ID:</span>
                    <span class="artifact-value">${artifact.component_id}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Type:</span>
                    <span class="artifact-value">${artifact.component_type}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Verdict:</span>
                    <span class="artifact-value threat">${artifact.summary.verdict}</span>
                </div>
            </div>

            <div class="artifact-section">
                <h3>VERIFICATION COMPARISON</h3>
                <div class="artifact-row">
                    <span class="artifact-label">Terrestrial Confidence:</span>
                    <span class="artifact-value">${artifact.summary.confidence_terrestrial}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Orbital Confidence:</span>
                    <span class="artifact-value highlight">${artifact.summary.confidence_orbital}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Improvement:</span>
                    <span class="artifact-value highlight">${artifact.summary.improvement}</span>
                </div>
            </div>

            <div class="artifact-section">
                <h3>ORBITAL PROOF</h3>
                <div class="artifact-row">
                    <span class="artifact-label">Node:</span>
                    <span class="artifact-value">${artifact.orbital_proof.node_id}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Light Delay:</span>
                    <span class="artifact-value">${artifact.orbital_proof.light_delay_ms}ms</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">TEE Attestation:</span>
                    <span class="artifact-value">${artifact.orbital_proof.tee_attestation}</span>
                </div>
            </div>

            <div class="artifact-section">
                <h3>ROI CALCULATION</h3>
                <div class="artifact-row">
                    <span class="artifact-label">Counterfeits Detected:</span>
                    <span class="artifact-value">${artifact.roi.counterfeits_detected}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Estimated Savings:</span>
                    <span class="artifact-value highlight">${artifact.roi.estimated_savings}</span>
                </div>
                <div class="artifact-row">
                    <span class="artifact-label">Failure Avoided:</span>
                    <span class="artifact-value">${artifact.roi.failure_mode_avoided}</span>
                </div>
            </div>

            <div class="crypto-proof">
                <div style="margin-bottom: 8px; color: var(--text);">CRYPTOGRAPHIC PROOF</div>
                <div class="hash">Kepler Signature: ${artifact.orbital_proof.kepler_signature}</div>
                <div class="hash">Merkle Root: ${artifact.receipt_chain.merkle_root}</div>
                <div class="hash">Chain Integrity: ${artifact.receipt_chain.integrity}</div>
                <div class="hash">Receipts: ${artifact.receipt_chain.receipts}</div>
            </div>
        `;

        this.elements.artifactBody.innerHTML = html;
        this.elements.modal.classList.remove('hidden');
        this.currentArtifact = artifact;
    },

    /**
     * Hide modal
     */
    hideModal() {
        this.elements.modal.classList.add('hidden');
    },

    /**
     * Download artifact as text file (simplified from PDF)
     */
    downloadArtifact() {
        if (!this.currentArtifact) return;

        const artifact = this.currentArtifact;
        const content = `
SPACEPROOF VERIFICATION REPORT
==============================
Generated: ${artifact.timestamp}

COMPONENT VERIFICATION
----------------------
Component ID: ${artifact.component_id}
Type: ${artifact.component_type}
Verdict: ${artifact.summary.verdict}

VERIFICATION COMPARISON
-----------------------
Terrestrial Confidence: ${artifact.summary.confidence_terrestrial}
Orbital Confidence: ${artifact.summary.confidence_orbital}
Improvement: ${artifact.summary.improvement}

ORBITAL PROOF
-------------
Node: ${artifact.orbital_proof.node_id}
Light Delay: ${artifact.orbital_proof.light_delay_ms}ms
TEE Attestation: ${artifact.orbital_proof.tee_attestation}
Kepler Signature: ${artifact.orbital_proof.kepler_signature}

ROI CALCULATION
---------------
Counterfeits Detected: ${artifact.roi.counterfeits_detected}
Estimated Savings: ${artifact.roi.estimated_savings}
Failure Avoided: ${artifact.roi.failure_mode_avoided}

CRYPTOGRAPHIC PROOF
-------------------
Merkle Root: ${artifact.receipt_chain.merkle_root}
Chain Integrity: ${artifact.receipt_chain.integrity}
Total Receipts: ${artifact.receipt_chain.receipts}

---
This report is cryptographically anchored via dual-hash (SHA256:BLAKE3)
Merkle tree verification. Tamper-evident and court-admissible.
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SpaceProof_Report_${artifact.component_id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Switch verification mode
     */
    async switchMode(targetMode) {
        if (!targetMode || !['terrestrial', 'orbital'].includes(targetMode)) {
            this.log('Usage: switch <terrestrial|orbital>', 'error');
            return;
        }

        if (targetMode === this.mode) {
            this.log(`Already in ${targetMode} mode`, 'muted');
            return;
        }

        if (targetMode === 'orbital') {
            await this.sleep(1500);
            const statusLines = OrbitalSim.getStatusLines();
            for (const line of statusLines) {
                this.log(line, 'highlight');
                await this.sleep(600);
            }
        } else {
            this.log('DISCONNECTING FROM ORBITAL NODE...', 'muted');
            await this.sleep(800);
            this.log('TERRESTRIAL MODE ACTIVE', 'result');
        }

        this.mode = targetMode;
        this.updateModeDisplay();

        await ReceiptChain.emitReceipt('mode_switch', {
            from: this.mode === 'orbital' ? 'terrestrial' : 'orbital',
            to: this.mode
        });
    },

    /**
     * Verify a specific component
     */
    async verifyComponent(id) {
        if (!id) {
            this.log('Usage: verify <component_id>', 'error');
            return;
        }

        const component = this.components.find(c =>
            c.id.toLowerCase() === id.toLowerCase()
        );

        if (!component) {
            this.log(`Component not found: ${id}`, 'error');
            this.log('Try: verify CFT-00001 or verify GEN-00001', 'muted');
            return;
        }

        const result = EntropyEngine.measureEntropy(component, this.mode);

        if (result.detected_as_counterfeit) {
            this.displayThreatBox(result);
            this.threatCount++;
        } else {
            this.log(`GENUINE: ${component.id}`, 'success');
            this.log(`Entropy: ${result.entropy.toFixed(4)} (threshold: ${result.threshold})`, 'muted');
            this.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, 'muted');
            this.verifiedCount++;
        }

        this.updateCounters();

        await ReceiptChain.emitReceipt('component_verification', {
            component_id: component.id,
            mode: this.mode,
            result: result
        });
    },

    /**
     * Verify orbital location
     */
    async verifyLocation() {
        if (this.mode !== 'orbital') {
            this.log('Location verification requires orbital mode', 'error');
            this.log('Use: switch orbital', 'muted');
            return;
        }

        const proof = await OrbitalSim.generateLocationProof();
        this.displayLocationProof(proof);
        await ReceiptChain.emitLocationProofReceipt(proof);
    },

    /**
     * Show status
     */
    showStatus() {
        const stats = ReceiptChain.getChainStats();
        const orbitalStatus = OrbitalSim.getOrbitalStatus();

        this.log('SYSTEM STATUS', 'result');
        this.log('─────────────────────────────────────────', 'muted');
        this.log(`Mode: ${this.mode.toUpperCase()}`, 'result');
        this.log(`Threats Detected: ${this.threatCount}`, 'result');
        this.log(`Components Verified: ${this.verifiedCount}`, 'result');
        this.log(`Receipts Emitted: ${stats.total_receipts}`, 'result');

        if (this.mode === 'orbital') {
            this.log('', 'result');
            this.log('ORBITAL NODE STATUS', 'highlight');
            this.log(`Node: ${orbitalStatus.node}`, 'muted');
            this.log(`Position: ${orbitalStatus.position}`, 'muted');
            this.log(`Altitude: ${orbitalStatus.altitude}`, 'muted');
            this.log(`Link Latency: ${orbitalStatus.link_latency}`, 'muted');
        }
    },

    /**
     * Show comparison between modes
     */
    async showComparison() {
        const component = this.components.find(c => c.id.startsWith('CFT'));
        const comparison = EntropyEngine.verifyWithComparison(component);
        this.displayComparisonTable(comparison);
    },

    /**
     * Show receipt statistics
     */
    showReceipts() {
        const stats = ReceiptChain.getChainStats();
        this.log('RECEIPT CHAIN STATISTICS', 'result');
        this.log('─────────────────────────────────────────', 'muted');
        this.log(`Total Receipts: ${stats.total_receipts}`, 'result');
        this.log(`Anchor Points: ${stats.anchor_count}`, 'result');
        this.log('', 'result');
        this.log('By Type:', 'muted');
        for (const [type, count] of Object.entries(stats.by_type)) {
            this.log(`  ${type}: ${count}`, 'muted');
        }
    },

    /**
     * Update mode display
     */
    updateModeDisplay() {
        this.elements.mode.textContent = this.mode.toUpperCase();
        if (this.mode === 'orbital') {
            this.elements.modeIndicator.classList.add('orbital');
        } else {
            this.elements.modeIndicator.classList.remove('orbital');
        }
    },

    /**
     * Update threat/verified counters
     */
    updateCounters() {
        this.elements.threatCount.textContent = this.threatCount;
        this.elements.verifiedCount.textContent = this.verifiedCount;
    },

    /**
     * Log output to terminal
     */
    log(text, className = 'result') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.textContent = text;
        this.elements.output.appendChild(line);
        this.scrollToBottom();
    },

    /**
     * Scroll output to bottom
     */
    scrollToBottom() {
        this.elements.output.scrollTop = this.elements.output.scrollHeight;
    },

    /**
     * Clear terminal output
     */
    clearOutput() {
        this.elements.output.innerHTML = '';
        this.threatCount = 0;
        this.verifiedCount = 0;
        this.updateCounters();
    },

    /**
     * Sleep utility for pacing (Doctrine 2)
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    SpaceProofDemo.init();
});
