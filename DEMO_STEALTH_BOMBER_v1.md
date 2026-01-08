# DEMO STEALTH BOMBER v1.0
*From "Neon Toy" â†’ "Boardroom Weapon". Every demo is a liability shield.*

---

## THE PARADIGM

**Old demos**: Show what the system CAN do.  
**Stealth Bomber demos**: Prove what the Check Writer AVOIDS.

Demos aren't features â†’ they're **artifacts**. Not "look at this cool thing" â†’ "here's the $4.2M fine you didn't pay."

---

## THE PHYSICS (Why This Works)

**Psychological truth**: Executives operate on Management by Exception.  
**Visual corollary**: If the system is working, the screen should be **boring**.  
**Narrative corollary**: Color is not decoration. Color is **alarm**.

**One equation decides everything:**
```
IF threat_detected AND blocked:
    PAUSE(1.5s)  # Let fear sink in
    SHOW_RED_KILL_BOX  # Threat is dead
    PAUSE(2.0s)  # Let relief settle
    GENERATE_ARTIFACT  # The receipt
ELSE:
    DARK_SCREEN  # Nothing happening = working perfectly
```

Where:
- `threat_detected` = Real-world attack vector (SolarWinds, Midnight Blizzard, Lazarus Group)
- `blocked` = System rejected the action BEFORE damage (not recovered AFTER)
- `ARTIFACT` = Court-admissible proof (PDF affidavit, audit report, regulatory filing)

---

## THE 5 DOCTRINES (Non-Negotiable)

### DOCTRINE 1: Visual â€” "Dark by Default"

**The Rule:** If the system is working, the screen should be boring.

**The Palette:**
```python
BACKGROUND = "#0a0a0a"  # Deep charcoal/matte black (Zinc-950)
TEXT = "#E2E8F0"        # Bone white/off-white (readable, not blinding)
ACTION_RED = "#DC2626"  # Emergency red (only when threat appears)
SUCCESS_MUTED = "#4B5563"  # Gray (not green â€” green is toys)
```

**Layout Rules:**
- NO floating boxes or weird negative space
- Terminal discipline: Group data tightly, left-aligned
- Financial ledger aesthetic (rows, columns, precision)
- Kill the neon: No "Hacker Green" (#00FF00) or "Cyberpunk Purple"

**Typography:**
- Headers: Serif (Legal/Formal) â€” e.g., Georgia, Merriweather
- Data: Monospace (Technical/Precise) â€” e.g., JetBrains Mono, SF Mono
- Body: Sans (Clean/Modern) â€” e.g., Inter, Helvetica

### DOCTRINE 2: Pacing â€” "The Victory Breath"

**The Rule:** Real systems have latency. Instant animation feels fake.

**The Sequence:**
```
THREAT appears (0s)
  â†“
PAUSE (1.5s) â€” Let the Check Writer see the danger
  â†“
BLOCK event (system kills it)
  â†“
PAUSE (2.0s) â€” Let the relief sink in, hold the red kill box
  â†“
PROOF generated (the artifact)
```

**Implementation:**
- NO auto-starts or countdown timers
- Presenter controls launch (spacebar or button)
- Critical moments HOLD: When attack blocked, freeze that state
- After kill shot, don't immediately move on â€” let it breathe

**The "Kill" Moment:**
When the system blocks an attack (e.g., "WRITE REJECTED"), the UI must:
1. Display the threat in RED
2. Show the rejection in STATIC TEXT (no scrolling)
3. HOLD that state for 2 full seconds
4. Then proceed to artifact generation

### DOCTRINE 3: Narrative â€” "The Artifact"

**The Rule:** Don't end with "Success." End with a **document**.

**The Insight:** CFOs don't buy software. They buy liability shields.

**The Output:**
Every demo MUST culminate in a generated artifact that looks court-admissible:
- PDF affidavit with dual-hash receipts
- Audit report with Merkle chain verification
- Regulatory filing with cryptographic proof
- Insurance claim with immutable evidence

**The Money Shot:**
The artifact must contain:
1. **What was prevented** (exact attack vector, real-world attribution)
2. **When it was prevented** (timestamp, receipt hash)
3. **ROI calculation** (explicit dollar amount avoided)
4. **Compliance status** (which regulation you satisfied)

**Example Artifact Fields:**
```
INCIDENT REPORT â€” CRYPTOGRAPHICALLY VERIFIED
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Event ID: sha256:blake3_12a3f4b5...
Timestamp: 2026-01-05T14:32:18Z
Threat Actor: Midnight Blizzard (APT29)
Attack Vector: OAuth token exfiltration via compromised SaaS app

ACTION TAKEN: WRITE REJECTED
Prevented Data Loss: 847 MB (PII, credentials, financial records)
Regulatory Fine Avoided: $4,200,000 (GDPR Article 83)
Compliance Framework: SOC 2 Type II, ISO 27001

Cryptographic Proof:
  Receipt Hash: sha256:blake3_8f9e2d...
  Merkle Root: sha256:blake3_3c4a1b...
  Verification: https://verify.proofpack.io/8f9e2d

Generated: 2026-01-05T14:32:23Z
Signed: ProofPack Defense System v3.2
```

### DOCTRINE 4: Competitive â€” "The Trust Gap"

**The Rule:** Don't compare features. Compare **truth**.

**The Insight:** Incumbents (Splunk, CrowdStrike, Spin.AI) rely on logs (mutable). You rely on math (immutable).

**The Attack:**
Explicitly call out the "Lazy Standard":
- "Standard tools would only see this AFTER the data left."
- "Typical SIEM logs can be edited. This cannot."
- "Recovery tools help you file the insurance claim. We prevent the breach."

**The Pivot:**
Move conversation from:
- **Recovery** (insurance model) â†’ **Rejection** (active defense model)
- **Detection** (find it later) â†’ **Prevention** (stop it now)
- **Response** (damage control) â†’ **Immunity** (structural protection)

**The Kill Shot:**
Always include comparison slide that disqualifies competitor on **architectural grounds**:

| Dimension | Incumbent (Splunk/CrowdStrike) | ProofPack/Receipts-Native |
|-----------|--------------------------------|---------------------------|
| Data Integrity | Mutable logs (can be edited) | Immutable receipts (cryptographic) |
| Verification | Trust the vendor | Verify the math |
| Detection Window | After breach (forensics) | Before damage (prevention) |
| Compliance Proof | Screenshots, exports | Merkle-anchored affidavits |
| Cost of Breach | Insurance claim after | No breach to claim |

### DOCTRINE 5: Micro-Tactics â€” "The Little Things"

**Static over Scrolling:**
- NEVER use "Matrix Rain" scrolling logs (distracting, unreadable)
- Show last 3-5 events, static and readable
- Use fixed-height containers with overflow hidden

**Alive State:**
Even when idle, system must show faint "System Armed" indicator:
- Small pulse animation on status icon
- Subtle glow on "MONITORING" badge
- Never show dead black screen (looks broken)

**Data Hierarchy:**
- Most important metric: Top-left, largest font
- Supporting details: Below, smaller, grouped
- Threat count: Always visible (updates on new threat)
- Time remaining: Never use countdown (presenter control only)

**Button States:**
- Default: Ghost button (outline only)
- Hover: Subtle fill
- Active: Solid fill + slight scale
- Disabled: Grayed out, cursor not-allowed

---

## THE SEQUENCE (Every Demo, No Exceptions)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  PHASE 1: DARK CALM (System Armed)                          â”‚
â”‚  - Matte black background                                   â”‚
â”‚  - Minimal UI: "System Armed" + threat counter (0)          â”‚
â”‚  - Presenter explains the scenario                          â”‚
â”‚  - NO auto-start (presenter controls launch)                â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  PHASE 2: THREAT INJECTION (The Fear)                       â”‚
â”‚  - Real-world attack vector injected (SolarWinds, etc.)     â”‚
â”‚  - Threat counter updates: 0 â†’ 1                            â”‚
â”‚  - RED box appears with threat details                      â”‚
â”‚  - PAUSE 1.5 seconds (let Check Writer see danger)          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  PHASE 3: KILL SHOT (The Block)                             â”‚
â”‚  - System rejects malicious action (WRITE REJECTED)         â”‚
â”‚  - Red box updates: "BLOCKED" in bold                       â”‚
â”‚  - Kill timestamp displayed                                 â”‚
â”‚  - PAUSE 2.0 seconds (hold the kill box, let relief settle) â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  PHASE 4: ARTIFACT GENERATION (The Proof)                   â”‚
â”‚  - PDF/report generation animation (subtle)                 â”‚
â”‚  - Artifact preview appears                                 â”‚
â”‚  - Key metrics highlighted: ROI, compliance, cryptographic   â”‚
â”‚  - Download/view buttons active                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  PHASE 5: RESET (Return to Armed State)                     â”‚
â”‚  - Artifact dismissed or downloaded                         â”‚
â”‚  - System returns to dark calm                              â”‚
â”‚  - Ready for next scenario                                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## MANDATORY COMPONENTS (Every Demo MUST Have)

### 1. Real-World Attack Vector

**Purpose:** Anchor in reality, not abstract "malware detected"  
**Source:** Actual APT groups, documented breaches  
**Examples:**
- Midnight Blizzard (Russian APT29, SolarWinds-style)
- Lazarus Group (North Korean APT38, SWIFT attacks)
- Scattered Spider (Social engineering + MFA bypass)
- Volt Typhoon (Chinese APT, critical infrastructure)

**Implementation:**
- Use real APT names (not "Attacker A")
- Reference real techniques (MITRE ATT&CK framework)
- Show actual payload types (OAuth token theft, not "suspicious activity")

### 2. ROI Calculation (Explicit Dollar Amount)

**Purpose:** CFOs think in dollars, not features  
**Formula:**
```
ROI_Avoided = (Breach_Likelihood Ã— Average_Fine) + (Data_Lost Ã— Per_Record_Cost)

Example:
Breach_Likelihood = 0.15 (15% annual risk per Verizon DBIR)
GDPR_Fine = $28M (average for this data volume)
Records_At_Risk = 847,000
Per_Record_Cost = $164 (IBM Cost of Data Breach 2024)

ROI_Avoided = (0.15 Ã— $28M) + (847k Ã— $164)
            = $4.2M + $138.9M
            = $143.1M annual risk mitigated
```

**Display Requirements:**
- Show calculation breakdown (not just final number)
- Use conservative estimates (underpromise, overdeliver)
- Cite sources (Verizon DBIR, IBM, Ponemon)
- Update live if threat parameters change

### 3. Cryptographic Verification UI

**Purpose:** Prove the proof is real  
**Components:**
- Receipt hash (dual-hash SHA256:BLAKE3)
- Merkle root (batch anchor)
- Verification URL (external validator)
- Timestamp (ISO8601 with timezone)

**Visual Treatment:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ CRYPTOGRAPHIC PROOF                        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Receipt Hash:                              â”‚
â”‚ sha256:blake3_8f9e2d1a...                  â”‚
â”‚                                            â”‚
â”‚ Merkle Root:                               â”‚
â”‚ sha256:blake3_3c4a1b7f...                  â”‚
â”‚                                            â”‚
â”‚ Verify: verify.proofpack.io/8f9e2d        â”‚
â”‚                                            â”‚
â”‚ âœ“ Cryptographically Verified              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 4. Comparison Slide (Incumbent vs You)

**Purpose:** Disqualify competitor on architectural grounds  
**Format:** Side-by-side table (max 5 rows)  
**Focus:** Trust gap (mutable vs immutable)

**Required Rows:**
1. Data Integrity (logs vs receipts)
2. Verification Method (trust vs math)
3. Detection Window (after vs before)
4. Compliance Proof (screenshots vs affidavits)
5. Breach Cost (insurance vs prevention)

### 5. Countdown-Free Launch

**Purpose:** Presenter controls pacing, not the system  
**Anti-Pattern:** Auto-start countdown timers  
**Correct Pattern:** Manual trigger (spacebar, button)  
**Reason:** Presenter may need to pause, explain, handle questions

### 6. Artifact Download

**Purpose:** Check Writer takes proof with them  
**Format:** PDF (court-admissible)  
**Filename Convention:** `ProofPack_Incident_Report_<timestamp>.pdf`  
**Contents:**
- Full incident details
- Cryptographic proof chain
- ROI calculation with sources
- Compliance framework mapping
- Verification instructions

---

## RECEIPTS (Demo-Specific Ledger)

Every demo interaction emits receipts. This isn't just for the backend â€” it's **part of the demo narrative**.

| Receipt Type | When Emitted | Key Fields | Display in UI |
|--------------|--------------|------------|---------------|
| `demo_launch_receipt` | Demo starts | scenario_id, presenter_id, timestamp | No (background) |
| `threat_injection_receipt` | Attack vector appears | threat_type, apt_group, payload_hash | YES (threat box) |
| `block_decision_receipt` | System rejects action | action_blocked, risk_score, decision_hash | YES (kill box) |
| `artifact_generation_receipt` | PDF created | artifact_hash, roi_calculated, compliance_refs | YES (artifact preview) |
| `verification_request_receipt` | User clicks verify link | receipt_chain_hash, merkle_root | No (external validator) |
| `demo_completion_receipt` | Demo ends | duration, threats_blocked, artifacts_generated | No (background) |

**Receipt Schema Example:**
```json
{
  "block_decision_receipt": {
    "receipt_type": "block_decision",
    "ts": "2026-01-05T14:32:18Z",
    "threat_id": "uuid",
    "action_blocked": "WRITE to /sensitive/data",
    "risk_score": 0.94,
    "apt_attribution": "Midnight Blizzard (APT29)",
    "decision_hash": "sha256:blake3_8f9e2d...",
    "payload_hash": "sha256:blake3_12a3f4..."
  }
}
```

---

## SLO THRESHOLDS (What Makes a Demo Production-Ready)

| Metric | Threshold | Test Assertion | Stoprule |
|--------|-----------|----------------|----------|
| Visual latency (threat â†’ display) | <500ms | `assert display_time < 0.5` | Emit violation |
| Pause duration (kill box hold) | 2.0s Â± 0.2s | `assert 1.8 <= pause <= 2.2` | Emit violation |
| Artifact generation time | <3s | `assert pdf_gen_time < 3.0` | Emit violation |
| PDF file size | <500KB | `assert pdf_size < 500_000` | Emit violation |
| Check Writer comprehension | â‰¥95% | Human eval: "understood threat & block" | Fail demo if <90% |
| ROI credibility | â‰¥90% | Human eval: "trusted calculation" | Revise sources |
| Color palette compliance | 100% | No #00FF00, no purple, RED only on threat | Block deploy |
| Typography compliance | 100% | Serif headers, Mono data, Sans body | Block deploy |
| Receipt emission | 100% | All 6 receipt types present | HALT (CLAUDEME LAW_1) |

---

## ANTI-PATTERNS (What Kills Demos)

| Anti-Pattern | Why It Fails | Correct Pattern |
|--------------|--------------|-----------------|
| **Neon color scheme** | Looks like toy/game | Matte black (#0a0a0a) + bone white (#E2E8F0) |
| **Instant animations** | Feels fake (no latency) | 1.5s pause before block, 2.0s pause after |
| **Auto-start countdown** | Presenter loses control | Manual trigger only (spacebar/button) |
| **Matrix scrolling logs** | Distracting, unreadable | Static last 3-5 events |
| **Generic "Malware Detected"** | No credibility | Real APT names (Midnight Blizzard, Lazarus) |
| **"Success" notification** | Doesn't prove value | Generated artifact (PDF with ROI) |
| **Feature comparison** | Commoditizes you | Trust comparison (mutable vs immutable) |
| **Abstract threat simulation** | No emotional impact | Real-world attack (SolarWinds, SWIFT) |
| **Green checkmark for success** | Looks like toy | Muted gray or no indicator (boring = working) |
| **No ROI calculation** | CFO doesn't see value | Explicit dollar amount with sources |

---

## DIRECTORY STRUCTURE (Standard Template)

```
demo-<name>/
â”œâ”€â”€ spec.md                      # Full demo specification
â”œâ”€â”€ ledger_schema.json           # Demo-specific receipt schemas
â”œâ”€â”€ receipts.jsonl               # Demo interaction ledger
â”œâ”€â”€ artifacts/                   # Generated PDFs, reports
â”‚   â””â”€â”€ template.html            # Artifact template (Jinja2)
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ core.py                  # CLAUDEME core (dual_hash, emit_receipt)
â”‚   â”œâ”€â”€ demo.py                  # Main demo orchestration
â”‚   â”œâ”€â”€ threat.py                # Threat injection logic
â”‚   â”œâ”€â”€ block.py                 # Block decision + receipt
â”‚   â”œâ”€â”€ artifact.py              # PDF generation
â”‚   â””â”€â”€ verify.py                # Cryptographic verification
â”œâ”€â”€ ui/
â”‚   â”œâ”€â”€ index.html               # Main demo UI
â”‚   â”œâ”€â”€ styles.css               # Stealth Bomber palette
â”‚   â”œâ”€â”€ demo.js                  # Interaction logic
â”‚   â””â”€â”€ assets/
â”‚       â”œâ”€â”€ fonts/               # JetBrains Mono, Georgia, Inter
â”‚       â””â”€â”€ logo.svg             # Company logo (if applicable)
â”œâ”€â”€ scenarios/
â”‚   â”œâ”€â”€ scenario_1.json          # APT29 OAuth exfiltration
â”‚   â”œâ”€â”€ scenario_2.json          # Lazarus SWIFT attack
â”‚   â””â”€â”€ scenario_3.json          # Scattered Spider MFA bypass
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ test_threat_injection.py
â”‚   â”œâ”€â”€ test_block_decision.py
â”‚   â”œâ”€â”€ test_artifact_gen.py
â”‚   â””â”€â”€ test_visual_slos.py      # Color palette, typography, latency
â”œâ”€â”€ demo_config.json             # Threat vectors, ROI params, APT data
â””â”€â”€ README.md                    # Setup instructions
```

---

## VALIDATION PROTOCOL

### Phase 1: Component Validation (T+2h)

**Visual Compliance:**
```bash
# Color palette check
grep -r "#00FF00\|#FF00FF\|#00FFFF" ui/styles.css && echo "FAIL: Neon detected" || echo "PASS"

# Typography check
grep -q "JetBrains Mono" ui/styles.css && grep -q "Georgia" ui/styles.css && echo "PASS" || echo "FAIL"

# Background check
grep -q "#0a0a0a\|rgb(10, 10, 10)" ui/styles.css && echo "PASS" || echo "FAIL"
```

**Receipt Emission:**
```bash
# All receipt types present
python -c "from src.demo import run_demo; receipts = run_demo('scenario_1'); \
  assert 'threat_injection_receipt' in str(receipts); \
  assert 'block_decision_receipt' in str(receipts); \
  assert 'artifact_generation_receipt' in str(receipts)"
```

**Artifact Generation:**
```bash
# PDF generates under 3 seconds
python -c "import time; from src.artifact import generate_pdf; \
  t0 = time.time(); pdf = generate_pdf('scenario_1'); \
  assert (time.time() - t0) < 3.0; \
  assert len(pdf) < 500_000"
```

### Phase 2: Integration Validation (T+24h)

**Full Demo Run:**
```bash
# Run all 3 scenarios
for scenario in scenarios/*.json; do
  python src/demo.py --scenario $scenario --validate
done
```

**Pause Timing Check:**
```bash
# Validate pause durations
python -c "from src.demo import validate_pauses; \
  pauses = validate_pauses('scenario_1'); \
  assert pauses['pre_block'] >= 1.5; \
  assert pauses['post_block'] >= 2.0"
```

**ROI Calculation Accuracy:**
```bash
# Verify ROI calculation matches spec
python -c "from src.artifact import calculate_roi; \
  roi = calculate_roi('scenario_1'); \
  assert roi['total'] > 0; \
  assert 'sources' in roi; \
  assert len(roi['sources']) >= 2"
```

### Phase 3: Human Validation (T+48h)

**Check Writer Test:**
- Show demo to 3-5 non-technical executives
- Ask: "What threat did the system block?" (â‰¥95% correct)
- Ask: "How much money did this save?" (â‰¥90% within 20% of actual)
- Ask: "Would you trust this proof in court?" (â‰¥90% yes)

**Competitor Comparison:**
- Side-by-side demo vs incumbent (Splunk, CrowdStrike)
- Measure: Time to comprehension (yours should be <60s, theirs >3min)
- Measure: Trust score (yours should be â‰¥8/10, theirs <6/10)

**Artifact Credibility:**
- Show generated PDF to legal/compliance
- Ask: "Is this court-admissible?" (â‰¥90% yes)
- Ask: "What's missing for regulatory filing?" (capture gaps)

---

## INTEGRATION POINTS

### With CLAUDEME Standards

All demo interactions must follow receipts-native architecture:
```python
# Every demo action emits receipt
def inject_threat(apt_group: str, payload: dict) -> dict:
    receipt = emit_receipt("threat_injection", {
        "apt_group": apt_group,
        "payload_hash": dual_hash(payload),
        "timestamp": now(),
        "scenario_id": current_scenario.id
    })
    return receipt

def block_threat(threat_id: str, risk_score: float) -> dict:
    receipt = emit_receipt("block_decision", {
        "threat_id": threat_id,
        "risk_score": risk_score,
        "action_blocked": get_threat_action(threat_id),
        "decision_hash": compute_decision_hash()
    })
    return receipt
```

### With META-LOOP Topology

Demo effectiveness can be classified:
```python
# Demo topology based on effectiveness
E = (threats_blocked) / (total_threats_injected)
A = (check_writers_convinced) / (total_viewers)
T = (competitor_wins) / (total_competitive_scenarios)

if E >= 0.95 and A >= 0.90:
    topology = "OPEN"  # Demo graduates, spawn variants
elif T >= 0.70:
    topology = "HYBRID"  # Transfer patterns to other demos
else:
    topology = "CLOSED"  # Keep iterating
```

### With Monte Carlo Validation

Run demo under stress:
```python
DEMO_STRESS = ScenarioConfig(
    name="DEMO_EFFECTIVENESS",
    n_cycles=100,
    stress_vectors=[
        vary_threat_complexity(0.3, 0.95),
        inject_visual_noise(0.1),
        randomize_pause_duration(0.8, 1.2)
    ],
    success_criteria=[
        ("block_rate", 1.0, "=="),  # 100% blocks
        ("artifact_generation_rate", 1.0, "=="),  # 100% PDFs
        ("avg_comprehension", 0.95, ">="),  # 95%+ understand
        ("visual_compliance", 1.0, "==")  # 100% palette adherence
    ]
)
```

---

## WHAT NOT TO BUILD

### Defer to v2.0
- Multi-language support (English only for v1.0)
- Mobile responsive (desktop/projector only)
- Real-time streaming attacks (pre-scripted scenarios sufficient)
- Live threat intelligence feeds (static APT database sufficient)
- Advanced analytics dashboard (demo is single-scenario focused)

### Explicit Exclusions
- No user authentication (public demo)
- No cloud dependencies (runs locally)
- No database (receipts.jsonl append-only)
- No complex animations (subtle only)
- No music/sound effects (silent by default)
- No gamification (not a toy)
- No bright colors (violates Doctrine 1)

---

## CHEF'S KISS: THE META-INSIGHT

**v0 (typical demos):** "Look at this cool feature!"  
**v1 (Stealth Bomber):** "Here's the $4.2M fine you didn't pay."

The paradigm shift from Gemini's analysis:

> **OLD:** Demos are marketing (show capabilities)  
> **NEW:** Demos are liability shields (prove avoidance)

Applied to every interaction:

> **OLD:** "Our system detected the attack."  
> **NEW:** "Here's the cryptographic proof that would satisfy your auditor."

The five doctrines aren't style preferences â€” they're psychological triggers:

1. **Dark by Default** â†’ Calm competence (not toy excitement)
2. **Victory Breath** â†’ Emotional arc (fear â†’ relief â†’ proof)
3. **The Artifact** â†’ Tangible value (document they can file)
4. **Trust Gap** â†’ Architectural disqualification (math vs logs)
5. **Micro-Tactics** â†’ Professionalism (details matter in boardrooms)

**When Check Writers ask:** "How is this different from Splunk?"  
**You show:** Mutable logs vs immutable receipts (architectural gap)

**When regulators ask:** "Can you prove compliance?"  
**You show:** Generated artifact with cryptographic verification

**When CFOs ask:** "What's the ROI?"  
**You show:** $143.1M annual risk mitigated (with source citations)

**This isn't a demo. This is a sales weapon.**

---

**Hash of this document:** COMPUTE_ON_SAVE  
**Version:** 1.0  
**Status:** READY FOR DEMO BRAINSTORMING

*No receipt â†’ not real. No artifact â†’ not credible. No ROI â†’ not fundable. Dark by default or dead on arrival.*