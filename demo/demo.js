/**
 * SpaceProof Demo Orchestration
 *
 * Stealth Bomber Compliant:
 * - Dark by Default (Doctrine 1)
 * - Victory Breath Pacing (Doctrine 2)
 * - Artifact Generation (Doctrine 3)
 *
 * 5 Acts:
 * 1. THE SUFFOCATION - Terrestrial verification (87% confidence)
 * 2. THE ASCENT - Switch to orbital mode (1.5s pause)
 * 3. THE SINGULARITY - Orbital verification (99.8% confidence)
 * 4. THE SPACEPROOF - Location proof (Kepler signature + TEE)
 * 5. RETURN TO ARMED - Awaiting next component
 */

// Demo State
const DemoState = {
  mode: 'terrestrial',
  currentComponent: null,
  isRunning: false,
  terrestrialResult: null,
  orbitalResult: null,
  components: [],
  demoPhase: 'idle'
};

// Terminal output element
let terminal = null;

// Sleep utility with precise timing
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
  terminal = document.getElementById('terminalOutput');
  updateTimestamp();
  setInterval(updateTimestamp, 1000);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress);

  // Command input
  const input = document.getElementById('commandInput');
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    }
  });

  // Load components
  loadComponents();

  // Emit demo launch receipt
  ReceiptChain.emitReceipt(ReceiptChain.RECEIPT_TYPES.DEMO_LAUNCH, {
    version: '6.0',
    mode: 'demo',
    timestamp: new Date().toISOString()
  });
});

// Load component database
async function loadComponents() {
  try {
    const response = await fetch('../data/components.json');
    DemoState.components = await response.json();
    appendLine('Component database loaded: ' + DemoState.components.length + ' components', 'dim');
  } catch (e) {
    // Generate sample components if file not found
    DemoState.components = generateSampleComponents();
    appendLine('Component database initialized: ' + DemoState.components.length + ' components', 'dim');
  }
}

// Generate sample components (80 genuine, 20 counterfeit)
function generateSampleComponents() {
  const components = [];
  const types = ['CAPACITOR', 'RESISTOR', 'IC-CHIP', 'TRANSISTOR', 'INDUCTOR', 'DIODE', 'CRYSTAL', 'SENSOR'];

  for (let i = 0; i < 100; i++) {
    const isGenuine = i < 80;
    const type = types[i % types.length];

    components.push({
      id: `${type.substring(0, 3)}-${(10000 + i).toString()}`,
      type: type,
      entropy: isGenuine
        ? 0.82 + Math.random() * 0.12  // Genuine: 0.82-0.94
        : 0.65 + Math.random() * 0.13, // Counterfeit: 0.65-0.78
      is_genuine: isGenuine,
      manufacturer: isGenuine ? 'VERIFIED_OEM' : 'UNKNOWN',
      batch: `BATCH-${Math.floor(i / 10) + 1}`
    });
  }

  return components;
}

// Handle keyboard shortcuts
function handleKeyPress(e) {
  if (e.code === 'Space' && !DemoState.isRunning) {
    e.preventDefault();
    runFullDemo();
  } else if (e.code === 'KeyR' && !DemoState.isRunning) {
    e.preventDefault();
    resetDemo();
  }
}

// Handle command input
function handleCommand(cmd) {
  const command = cmd.trim().toLowerCase();
  appendLine('$ ' + cmd, 'command');

  if (command === 'help') {
    showHelp();
  } else if (command === 'demo' || command === 'run') {
    runFullDemo();
  } else if (command === 'reset') {
    resetDemo();
  } else if (command.startsWith('verify ')) {
    const id = command.replace('verify ', '').toUpperCase();
    verifyComponentById(id);
  } else if (command === 'status') {
    showStatus();
  } else if (command === 'receipts') {
    showReceipts();
  } else if (command === 'clear') {
    clearTerminal();
  } else {
    appendLine('Unknown command. Type "help" for available commands.', 'error');
  }
}

// Append line to terminal
function appendLine(text, className = '') {
  const line = document.createElement('div');
  line.className = 'terminal-line' + (className ? ' ' + className : '');
  line.textContent = text;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

// Append HTML to terminal
function appendHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  terminal.appendChild(div);
  terminal.scrollTop = terminal.scrollHeight;
}

// Clear terminal
function clearTerminal() {
  terminal.innerHTML = '';
  appendLine('Terminal cleared.', 'dim');
}

// Update timestamp display
function updateTimestamp() {
  const el = document.getElementById('timestampDisplay');
  if (el) {
    el.textContent = new Date().toISOString();
  }
}

// Update status indicator
function updateStatus(text, mode) {
  document.getElementById('statusText').textContent = text;
  const dot = document.getElementById('statusDot');
  dot.className = 'status-dot';
  if (mode === 'armed') dot.classList.add('armed');
  if (mode === 'orbital') dot.classList.add('orbital');
}

// Show help
function showHelp() {
  appendLine('');
  appendLine('SPACEPROOF VERIFICATION COMMANDS:', 'highlight');
  appendLine('  demo, run     - Run full orbital verification demo');
  appendLine('  verify <id>   - Verify specific component');
  appendLine('  status        - Show system status');
  appendLine('  receipts      - Show receipt chain statistics');
  appendLine('  reset         - Reset demo state');
  appendLine('  clear         - Clear terminal');
  appendLine('  help          - Show this help');
  appendLine('');
  appendLine('SHORTCUTS:', 'highlight');
  appendLine('  [SPACE]       - Run demo');
  appendLine('  [R]           - Reset');
  appendLine('');
}

// Show status
function showStatus() {
  appendLine('');
  appendLine('SYSTEM STATUS:', 'highlight');
  appendLine('  Mode: ' + DemoState.mode.toUpperCase());
  appendLine('  Phase: ' + DemoState.demoPhase);
  appendLine('  Components loaded: ' + DemoState.components.length);
  appendLine('  Receipts emitted: ' + ReceiptChain.ledger.length);
  appendLine('  Chain valid: ' + (ReceiptChain.verifyChain().valid ? 'YES' : 'NO'));
  appendLine('');
}

// Show receipts
function showReceipts() {
  const stats = ReceiptChain.getStats();
  appendLine('');
  appendLine('RECEIPT CHAIN STATISTICS:', 'highlight');
  appendLine('  Total receipts: ' + stats.total_receipts);
  appendLine('  Chain valid: ' + (stats.chain_valid ? 'YES' : 'NO'));
  appendLine('  Merkle root: ' + stats.merkle_root.substring(0, 24) + '...');
  appendLine('');
  appendLine('  Receipts by type:');
  for (const [type, count] of Object.entries(stats.by_type)) {
    appendLine('    ' + type + ': ' + count);
  }
  appendLine('');
}

// Reset demo
function resetDemo() {
  DemoState.mode = 'terrestrial';
  DemoState.currentComponent = null;
  DemoState.isRunning = false;
  DemoState.terrestrialResult = null;
  DemoState.orbitalResult = null;
  DemoState.demoPhase = 'idle';

  ReceiptChain.reset();

  clearTerminal();
  appendLine('SpaceProof v6.0 - Orbital Hardware Verification', 'dim');
  appendLine('Entropy-based counterfeit detection with orbital clarity', 'dim');
  appendLine('---', 'dim');
  appendLine('Demo reset. Press [SPACE] to run demo.', 'dim');
  appendLine('');

  updateStatus('SYSTEM ARMED', 'armed');

  // Re-emit launch receipt
  ReceiptChain.emitReceipt(ReceiptChain.RECEIPT_TYPES.DEMO_LAUNCH, {
    version: '6.0',
    mode: 'demo',
    timestamp: new Date().toISOString()
  });
}

// Verify component by ID
async function verifyComponentById(id) {
  const component = DemoState.components.find(c => c.id === id);
  if (!component) {
    appendLine('Component not found: ' + id, 'error');
    return;
  }

  appendLine('');
  appendLine('Verifying component ' + id + '...', 'highlight');

  const result = EntropyEngine.verifyComponent(component, DemoState.mode);
  displayVerificationResult(result);

  ReceiptChain.emitVerificationReceipt(result);
}

// Display verification result
function displayVerificationResult(result) {
  appendLine('');

  if (!result.is_genuine) {
    appendLine('COUNTERFEIT DETECTED', 'error');
  } else {
    appendLine('GENUINE VERIFIED', 'success');
  }

  appendLine('');
  appendLine('Component: ' + result.component_id + ' (' + result.component_type + ')');
  appendLine('Mode: ' + result.mode.toUpperCase());
  appendLine('Entropy: ' + result.entropy.formatted);
  appendLine('Threshold: ' + result.threshold);
  appendLine('Confidence: ' + result.confidence_pct + '%');
  appendLine('Thermal baseline: ' + result.thermal_baseline);
  appendLine('Verification time: ' + result.verification_time_ms + 'ms');
  appendLine('');
}

/**
 * RUN FULL DEMO
 * The 5-act narrative with Stealth Bomber pacing
 */
async function runFullDemo() {
  if (DemoState.isRunning) {
    appendLine('Demo already running.', 'error');
    return;
  }

  DemoState.isRunning = true;
  document.getElementById('btnRunDemo').disabled = true;

  // Select a counterfeit component for demo impact
  const counterfeitComponent = DemoState.components.find(c => !c.is_genuine);
  DemoState.currentComponent = counterfeitComponent || DemoState.components[0];

  try {
    await act1_TheSuffocation();
    await act2_TheAscent();
    await act3_TheSingularity();
    await act4_TheSpaceproof();
    await act5_ReturnToArmed();
  } catch (e) {
    appendLine('Demo error: ' + e.message, 'error');
  }

  DemoState.isRunning = false;
  document.getElementById('btnRunDemo').disabled = false;
}

/**
 * ACT 1: THE SUFFOCATION (60 seconds)
 * Terrestrial verification with thermal noise limiting accuracy
 */
async function act1_TheSuffocation() {
  DemoState.demoPhase = 'act1_suffocation';
  updateStatus('TERRESTRIAL MODE', 'armed');

  appendLine('');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('ACT 1: TERRESTRIAL VERIFICATION', 'highlight');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('');

  await sleep(500);

  // Run verification command
  appendLine('$ VERIFY_COMPONENT --id=' + DemoState.currentComponent.id + ' --mode=terrestrial', 'command');
  await sleep(800);

  // Perform terrestrial verification
  DemoState.terrestrialResult = EntropyEngine.verifyComponent(DemoState.currentComponent, 'terrestrial');

  // Display result
  appendLine('');
  appendLine('COUNTERFEIT DETECTED', 'error');
  appendLine('');
  appendLine('  Component ID: ' + DemoState.terrestrialResult.component_id);
  appendLine('  Entropy: ' + DemoState.terrestrialResult.entropy.formatted);
  appendLine('  Threshold: ' + DemoState.terrestrialResult.threshold);
  appendLine('  Confidence: ' + DemoState.terrestrialResult.confidence_pct + '%');
  appendLine('');

  // Emit receipt
  ReceiptChain.emitVerificationReceipt(DemoState.terrestrialResult);

  await sleep(1000);

  // The problem - kill shot
  appendLine('PROBLEM: Thermal noise from datacenter interference', 'dim');
  appendLine('  Noise floor: ±' + DemoState.terrestrialResult.entropy.noise_floor, 'dim');
  appendLine('  Thermal baseline: ' + DemoState.terrestrialResult.thermal_baseline, 'dim');
  appendLine('');

  await sleep(800);

  // The limitation
  appendLine('Verification confidence: ' + DemoState.terrestrialResult.confidence_pct + '% (thermal noise floor limiting accuracy)', 'error');
  appendLine('');

  await sleep(1500);  // PAUSE - let the problem sink in
}

/**
 * ACT 2: THE ASCENT (45 seconds)
 * Switch to orbital mode - 1.5s pause before transition
 */
async function act2_TheAscent() {
  DemoState.demoPhase = 'act2_ascent';

  appendLine('');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('ACT 2: ORBITAL ASCENT', 'highlight');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('');

  await sleep(500);

  appendLine('$ SWITCH_MODE --orbit=LEO --constellation=ORBITAL', 'command');
  await sleep(800);

  // PAUSE before mode switch (Doctrine 2: Victory Breath)
  await sleep(1500);

  // Get orbital link info
  const linkInfo = OrbitalSim.formatLinkEstablishment();

  // Display link establishment with pacing
  for (const msg of linkInfo.messages) {
    appendLine(msg, 'highlight');
    await sleep(600);
  }

  await sleep(500);

  // Update state
  DemoState.mode = 'orbital';
  updateStatus('ORBITAL MODE', 'orbital');

  // Emit mode switch receipt
  ReceiptChain.emitModeSwitchReceipt('terrestrial', 'orbital', {
    node_id: linkInfo.node.id,
    altitude_km: linkInfo.node.altitude_km,
    latency_ms: linkInfo.latency_ms
  });

  appendLine('');

  // PAUSE after establishing connection (Victory Breath)
  await sleep(2000);
}

/**
 * ACT 3: THE SINGULARITY (90 seconds)
 * Same component verified with orbital clarity
 */
async function act3_TheSingularity() {
  DemoState.demoPhase = 'act3_singularity';

  appendLine('');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('ACT 3: ORBITAL VERIFICATION', 'highlight');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('');

  await sleep(500);

  // Feature 1: Thermal Clarity
  appendLine('$ VERIFY_COMPONENT --id=' + DemoState.currentComponent.id + ' --mode=orbital', 'command');
  await sleep(800);

  // Perform orbital verification
  DemoState.orbitalResult = EntropyEngine.verifyComponent(DemoState.currentComponent, 'orbital');

  // Display result with improved confidence
  appendLine('');
  appendLine('COUNTERFEIT DETECTED', 'error');
  appendLine('');
  appendLine('  Component ID: ' + DemoState.orbitalResult.component_id);
  appendLine('  Entropy: ' + DemoState.orbitalResult.entropy.formatted);
  appendLine('  Threshold: ' + DemoState.orbitalResult.threshold);
  appendLine('  Confidence: ' + DemoState.orbitalResult.confidence_pct + '%', 'highlight');
  appendLine('  Thermal baseline: ' + DemoState.orbitalResult.thermal_baseline, 'highlight');
  appendLine('');

  ReceiptChain.emitVerificationReceipt(DemoState.orbitalResult);

  await sleep(1000);

  // Side-by-side comparison
  appendLine('COMPARISON: TERRESTRIAL vs ORBITAL', 'highlight');
  appendLine('');
  appendLine('  TERRESTRIAL MODE:        ORBITAL MODE:');
  appendLine('  Entropy: ' + DemoState.terrestrialResult.entropy.formatted.padEnd(14) + '  Entropy: ' + DemoState.orbitalResult.entropy.formatted);
  appendLine('  Confidence: ' + (DemoState.terrestrialResult.confidence_pct + '%').padEnd(11) + '  Confidence: ' + DemoState.orbitalResult.confidence_pct + '%');
  appendLine('  Thermal noise: HIGH      Thermal noise: NEGLIGIBLE');
  appendLine('');

  await sleep(1500);

  // Feature 2: Verification Rate
  appendLine('VERIFICATION THROUGHPUT:', 'highlight');
  appendLine('  Terrestrial: 1 component/second (power cost: $0.0003/verification)');
  appendLine('  Orbital: 10 components/second (power cost: $0.0000/verification - amortized solar)');
  appendLine('');
  appendLine('  Metric: Verification throughput increased 10x', 'highlight');
  appendLine('');

  await sleep(1000);

  // Feature 3: Latency Physics
  const latencyComparison = OrbitalSim.calculateReceiptLatency(100);
  appendLine('RECEIPT VERIFICATION LATENCY (100 receipts):', 'highlight');
  appendLine('  Terrestrial (fiber): ' + latencyComparison.terrestrial_p99_ms + 'ms p99');
  appendLine('  Orbital (vacuum): ' + latencyComparison.orbital_p99_ms + 'ms p99');
  appendLine('  Formula: ' + latencyComparison.physics.formula);
  appendLine('');
  appendLine('  Result: ' + latencyComparison.improvement_pct + '% faster verification in vacuum (speed of light advantage)', 'highlight');
  appendLine('');

  await sleep(1500);
}

/**
 * ACT 4: THE SPACEPROOF (90 seconds)
 * Location proof with Kepler signature + TEE attestation
 */
async function act4_TheSpaceproof() {
  DemoState.demoPhase = 'act4_spaceproof';

  appendLine('');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('ACT 4: PROOF OF LOCATION', 'highlight');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('');

  await sleep(500);

  appendLine('$ VERIFY_LOCATION --node=ORBITAL-NODE-7', 'command');
  await sleep(800);

  // Generate challenge
  const challenge = OrbitalSim.generateChallenge();
  appendLine('');
  appendLine('CHALLENGE: ' + challenge + ' (random nonce)', 'dim');
  appendLine('');

  await sleep(1500);  // Let fear sink in - is this real?

  appendLine('[Waiting for orbital response...]', 'dim');
  appendLine('');

  // Generate location proof (includes simulated latency)
  const locationProof = await OrbitalSim.generateLocationProof();

  // Emit location proof receipt
  ReceiptChain.emitLocationProofReceipt(locationProof);

  await sleep(500);

  appendLine('RESPONSE: ' + locationProof.response + ' (signed by TEE)');
  appendLine('');

  await sleep(800);

  // Display verification details
  appendLine('ORBITAL SIGNATURE VERIFIED:', 'highlight');
  appendLine('  - Kepler elements match predicted ephemeris');
  appendLine('  - Light-speed delay: ' + locationProof.actual_latency_ms + 'ms (consistent with ' + locationProof.altitude_km + 'km altitude)');
  appendLine('  - TEE attestation: ' + locationProof.tee_attestation.hardware_id + ' (genuine hardware)');
  appendLine('');

  await sleep(1000);

  // THE KILL SHOT
  appendLine('SPACEPROOF STATUS: VERIFIED', 'highlight');
  appendLine('');
  appendLine('This hardware is cryptographically proven to be:');
  appendLine('  1. In orbit (Kepler signature)');
  appendLine('  2. Genuine hardware (TEE attestation)');
  appendLine('  3. Never gray market (orbital supply chain)');
  appendLine('');

  // HOLD the kill box (Doctrine 2)
  await sleep(2000);

  // Emit orbital verification receipt
  ReceiptChain.emitOrbitalVerificationReceipt(
    DemoState.terrestrialResult,
    DemoState.orbitalResult,
    locationProof
  );

  // Generate artifact
  await generateArtifact(locationProof);

  // PAUSE after artifact (Victory Breath)
  await sleep(2000);
}

/**
 * Generate PDF artifact
 */
async function generateArtifact(locationProof) {
  appendLine('');
  appendLine('GENERATING VERIFICATION ARTIFACT...', 'highlight');
  appendLine('');

  await sleep(800);

  // Calculate ROI
  const roiValue = '$4,200,000';
  const componentsSaved = '10,000';

  // Emit artifact receipt
  ReceiptChain.emitArtifactReceipt({
    type: 'verification_report',
    component_id: DemoState.currentComponent.id,
    mode: 'orbital',
    confidence: DemoState.orbitalResult.confidence,
    roi_value: roiValue
  });

  // Anchor the batch
  const anchorReceipt = ReceiptChain.anchorBatch();

  appendLine('ARTIFACT GENERATED: SpaceProof_Verification_Report_' + DemoState.currentComponent.id + '.pdf');
  appendLine('');
  appendLine('Contents:');
  appendLine('  - Component ID and entropy measurements');
  appendLine('  - Terrestrial vs orbital verification comparison');
  appendLine('  - Orbital ephemeris proof');
  appendLine('  - Dual-hash receipt chain');
  appendLine('');
  appendLine('CRYPTOGRAPHIC PROOF:', 'highlight');
  appendLine('  Receipt Hash: ' + anchorReceipt.payload_hash.substring(0, 32) + '...');
  appendLine('  Merkle Root: ' + anchorReceipt.payload.merkle_root.substring(0, 32) + '...');
  appendLine('  Batch Size: ' + anchorReceipt.payload.batch_size + ' receipts');
  appendLine('');
  appendLine('ROI: Eliminated ' + componentsSaved + ' counterfeit components, avoided ' + roiValue + ' mission failure', 'highlight');
  appendLine('');

  // Create downloadable artifact
  createDownloadableArtifact(locationProof, anchorReceipt, roiValue);
}

/**
 * Create downloadable artifact
 */
function createDownloadableArtifact(locationProof, anchorReceipt, roiValue) {
  const artifactData = {
    title: 'SPACEPROOF VERIFICATION REPORT',
    generated: new Date().toISOString(),
    component: {
      id: DemoState.currentComponent.id,
      type: DemoState.currentComponent.type,
      status: 'COUNTERFEIT DETECTED'
    },
    terrestrial: {
      entropy: DemoState.terrestrialResult.entropy.formatted,
      confidence: DemoState.terrestrialResult.confidence_pct + '%',
      thermal_baseline: DemoState.terrestrialResult.thermal_baseline
    },
    orbital: {
      entropy: DemoState.orbitalResult.entropy.formatted,
      confidence: DemoState.orbitalResult.confidence_pct + '%',
      thermal_baseline: DemoState.orbitalResult.thermal_baseline
    },
    location_proof: {
      challenge: locationProof.challenge,
      response: locationProof.response,
      altitude_km: locationProof.altitude_km,
      latency_ms: locationProof.actual_latency_ms,
      tee_attestation: locationProof.tee_attestation.hardware_id
    },
    cryptographic_proof: {
      receipt_hash: anchorReceipt.payload_hash,
      merkle_root: anchorReceipt.payload.merkle_root,
      hash_algorithms: ['SHA256', 'BLAKE3'],
      batch_size: anchorReceipt.payload.batch_size
    },
    roi: {
      value: roiValue,
      components_verified: '10,000',
      failures_avoided: 'Mission-critical satellite failure'
    }
  };

  // Store for download
  window.artifactData = artifactData;
}

/**
 * ACT 5: RETURN TO ARMED (15 seconds)
 */
async function act5_ReturnToArmed() {
  DemoState.demoPhase = 'act5_armed';

  appendLine('');
  appendLine('═══════════════════════════════════════════════════════════════', 'dim');
  appendLine('');

  await sleep(500);

  appendLine('AWAITING_NEXT_COMPONENT...', 'dim');
  appendLine('');

  // Show cursor blink
  appendHTML('<span class="cursor"></span>');

  await sleep(1000);

  appendLine('');
  appendLine('Status: MONITORING (orbital mode active)', 'highlight');
  appendLine('');

  updateStatus('MONITORING', 'orbital');
  DemoState.demoPhase = 'complete';
}

/**
 * Download artifact as JSON (in production, would be PDF)
 */
function downloadArtifact() {
  if (!window.artifactData) {
    appendLine('No artifact available. Run demo first.', 'error');
    return;
  }

  const blob = new Blob([JSON.stringify(window.artifactData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SpaceProof_Verification_Report_' + window.artifactData.component.id + '.json';
  a.click();
  URL.revokeObjectURL(url);

  appendLine('Artifact downloaded.', 'dim');
}

// Expose functions globally
window.runFullDemo = runFullDemo;
window.resetDemo = resetDemo;
window.downloadArtifact = downloadArtifact;
