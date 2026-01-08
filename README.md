# SpaceProof Orbital Verification Demo

Terminal-based demonstration of entropy-based hardware verification with orbital advantages.

## Overview

SpaceProof validates hardware authenticity via entropy detection. This demo shows how orbital compute environments provide superior verification accuracy by eliminating terrestrial thermal noise.

## Key Concepts

### Entropy Detection
- **Genuine hardware**: Entropy 0.82-0.94 (predictable manufacturing patterns)
- **Counterfeit hardware**: Entropy 0.65-0.78 (rework accumulates thermal signatures)
- **Threshold**: 0.82 (below = flagged for inspection)

### Orbital Advantages

1. **Thermal Clarity**: -270C radiative equilibrium eliminates datacenter interference
   - Terrestrial noise: +/-0.08 entropy variance
   - Orbital noise: +/-0.01 entropy variance
   - Result: Confidence improvement from ~87% to ~99.8%

2. **Verification Throughput**: Zero marginal energy cost
   - Terrestrial: 1 component/sec ($0.0003/verification)
   - Orbital: 10 components/sec (amortized solar, $0/verification)

3. **Speed of Light Advantage**: Vacuum propagation
   - Fiber: c/1.5 = 199,862 km/s (refractive index)
   - Vacuum: c = 299,792 km/s
   - Result: 40% faster receipt chain verification

4. **Proof of Location**: Challenge-response with Kepler signature
   - Light-speed delay verification
   - TEE attestation
   - Supply chain integrity (not gray market)

## Running the Demo

```bash
# Serve the demo directory
cd demo
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

Or simply open `demo/index.html` in a browser.

## Demo Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `verify <id>` | Verify component by ID |
| `switch <mode>` | Switch to terrestrial/orbital mode |
| `location` | Verify orbital node location |
| `compare` | Show mode comparison |
| `status` | Show system status |
| `receipts` | Show receipt chain stats |
| `demo` | Run full demonstration |
| `clear` | Clear terminal |

Press **SPACE** to run the full 5-act demo sequence.

## Demo Structure (5 Acts)

1. **The Suffocation**: Terrestrial verification with limitations
2. **The Ascent**: Switch to orbital mode
3. **The Singularity**: Demonstrate orbital advantages
4. **The SpaceProof**: Location proof + artifact generation
5. **Return to Armed**: Ready state

## Directory Structure

```
spaceproof_demo/
├── demo/
│   ├── index.html           # Terminal interface
│   ├── demo.js              # Main orchestration
│   ├── orbital_sim.js       # Kepler elements, position
│   ├── entropy_engine.js    # Entropy detection
│   ├── receipt_chain.js     # Dual-hash, Merkle
│   └── styles.css           # Dark palette
├── data/
│   ├── components.json      # 100 test components
│   └── orbital_params.json  # Orbital parameters
├── artifacts/
│   └── template.html        # Report template
├── ledger_schema.json       # Receipt schemas
└── README.md
```

## Receipt Types

All operations emit cryptographic receipts (dual-hash SHA256:BLAKE3):

- `demo_init`: Demo initialization
- `terrestrial_verification`: Ground-based verification
- `orbital_verification`: Orbital verification with comparison
- `mode_switch`: Mode transition
- `location_proof`: Orbital location verification
- `artifact_generation`: Report generation
- `anchor`: Merkle root anchoring
- `demo_complete`: Demo completion

## Compliance

- **CLAUDEME**: Receipts-native architecture (LAW_1: No receipt -> not real)
- **Stealth Bomber v1.0**: Dark palette, victory breath pacing, artifact generation

## Technical Specs

### Color Palette
- Background: #0a0a0a (deep charcoal)
- Text: #E2E8F0 (bone white)
- Threat: #DC2626 (emergency red)
- Success: #4B5563 (muted gray)
- Highlight: #F59E0B (amber/orbital)

### Pacing (Doctrine 2)
- Pre-block pause: 1.5s (let danger sink in)
- Post-block pause: 2.0s (victory breath)
- No auto-start (presenter controls)

### Physics
- Speed of light: 299,792.458 km/s
- Fiber refractive index: ~1.5
- Orbital altitude: 550 km (LEO)
- Light delay at 550km: ~3.7ms round-trip
