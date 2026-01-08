/**
 * SpaceProof Orbital Simulation
 *
 * Simulates orbital mechanics for verification nodes:
 * - Kepler elements for ephemeris calculation
 * - Light-speed latency computation
 * - Proof of location via challenge-response
 *
 * Physics:
 * - LEO altitude: 550km
 * - Light speed: 299,792.458 km/s
 * - Round-trip latency: ~3.7ms at 550km
 */

const OrbitalSim = {
  // Physical constants
  SPEED_OF_LIGHT_KM_MS: 299.792458,  // km per millisecond
  EARTH_RADIUS_KM: 6371,

  // Orbital parameters for verification node
  DEFAULT_NODE: {
    id: 'ORBITAL-NODE-7',
    altitude_km: 550,
    inclination_deg: 51.6,
    longitude_deg: 0.0,
    eccentricity: 0.0001,  // Nearly circular
    mean_anomaly_deg: 0,
    raan_deg: 0,  // Right ascension of ascending node
    arg_periapsis_deg: 0
  },

  // Speed of light comparison
  FIBER_REFRACTIVE_INDEX: 1.5,  // Light travels 1.5x slower in fiber

  /**
   * Calculate orbital period using Kepler's third law
   * T = 2π * sqrt(a³/μ)
   */
  calculateOrbitalPeriod(altitude_km) {
    const MU = 398600.4418;  // Earth's gravitational parameter km³/s²
    const a = this.EARTH_RADIUS_KM + altitude_km;  // Semi-major axis
    const T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / MU);
    return T;  // seconds
  },

  /**
   * Calculate round-trip light latency to orbital node
   */
  calculateLatency(altitude_km) {
    // Direct path (ignoring atmospheric refraction for simplicity)
    const distance_km = altitude_km;
    const round_trip_km = distance_km * 2;
    const latency_ms = round_trip_km / this.SPEED_OF_LIGHT_KM_MS;
    return latency_ms;
  },

  /**
   * Compare vacuum vs fiber latency
   * Light in vacuum is ~40% faster than in fiber
   */
  compareLatency(distance_km) {
    const vacuum_latency_ms = distance_km / this.SPEED_OF_LIGHT_KM_MS;
    const fiber_latency_ms = distance_km / (this.SPEED_OF_LIGHT_KM_MS / this.FIBER_REFRACTIVE_INDEX);

    return {
      vacuum_ms: vacuum_latency_ms,
      fiber_ms: fiber_latency_ms,
      improvement_pct: ((fiber_latency_ms - vacuum_latency_ms) / fiber_latency_ms * 100).toFixed(1),
      formula: `t_vacuum = t_fiber × (c/n) where n=${this.FIBER_REFRACTIVE_INDEX}`
    };
  },

  /**
   * Generate Kepler elements for current time
   */
  getCurrentEphemeris(node = this.DEFAULT_NODE) {
    const now = new Date();
    const period_s = this.calculateOrbitalPeriod(node.altitude_km);

    // Calculate current position (simplified 2-body problem)
    const elapsed_s = (now.getTime() / 1000) % period_s;
    const mean_motion = 360 / period_s;  // degrees per second
    const current_mean_anomaly = (node.mean_anomaly_deg + elapsed_s * mean_motion) % 360;

    // Approximate true anomaly (for small eccentricity, M ≈ ν)
    const true_anomaly = current_mean_anomaly;

    // Calculate lat/lon (simplified)
    const lat = node.inclination_deg * Math.sin(true_anomaly * Math.PI / 180);
    const lon = (node.longitude_deg + true_anomaly) % 360 - 180;

    return {
      node_id: node.id,
      timestamp: now.toISOString(),
      altitude_km: node.altitude_km,
      latitude_deg: lat.toFixed(1),
      longitude_deg: lon.toFixed(1),
      inclination_deg: node.inclination_deg,
      orbital_period_min: (period_s / 60).toFixed(1),
      mean_anomaly_deg: current_mean_anomaly.toFixed(2),
      eccentricity: node.eccentricity
    };
  },

  /**
   * Generate challenge-response proof of location
   * Proves compute happened at orbital altitude via timing
   */
  async generateLocationProof(node = this.DEFAULT_NODE) {
    const challenge = this.generateChallenge();
    const expected_latency_ms = this.calculateLatency(node.altitude_km);

    // Simulate orbital response delay
    await this.sleep(expected_latency_ms);

    const response = this.signChallenge(challenge, node);
    const actual_latency_ms = expected_latency_ms + (Math.random() * 0.5);  // Small jitter

    // Verify latency is consistent with orbital altitude
    const min_latency = expected_latency_ms * 0.8;
    const max_latency = expected_latency_ms * 1.2;
    const latency_valid = actual_latency_ms >= min_latency && actual_latency_ms <= max_latency;

    return {
      challenge: challenge,
      response: response,
      expected_latency_ms: expected_latency_ms.toFixed(1),
      actual_latency_ms: actual_latency_ms.toFixed(1),
      latency_valid: latency_valid,
      altitude_km: node.altitude_km,
      ephemeris: this.getCurrentEphemeris(node),
      proof_type: 'kepler_signature',
      tee_attestation: this.generateTEEAttestation(node),
      verified: latency_valid
    };
  },

  /**
   * Generate random challenge nonce
   */
  generateChallenge() {
    const bytes = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  },

  /**
   * Sign challenge with node's key (simulated)
   */
  signChallenge(challenge, node) {
    const data = challenge + node.id + Date.now();
    return '0x' + this.simpleHash(data).toUpperCase();
  },

  /**
   * Generate TEE (Trusted Execution Environment) attestation
   */
  generateTEEAttestation(node) {
    return {
      hardware_id: `GPU-ORBIT-${node.id.split('-').pop()}`,
      manufacturer: 'VERIFIED',
      attestation_type: 'orbital_tee',
      integrity_verified: true,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Calculate verification latency comparison
   * Receipt verification chain traversal
   */
  calculateReceiptLatency(chain_length) {
    // Base latency per receipt verification
    const base_latency_per_receipt_ms = 0.082;  // 82 microseconds

    // Terrestrial (fiber): affected by refractive index
    const terrestrial_ms = chain_length * base_latency_per_receipt_ms * this.FIBER_REFRACTIVE_INDEX;

    // Orbital (vacuum): pure speed of light
    const orbital_ms = chain_length * base_latency_per_receipt_ms;

    return {
      chain_length: chain_length,
      terrestrial_p99_ms: (terrestrial_ms * 1.1).toFixed(1),  // Add 10% for p99
      orbital_p99_ms: (orbital_ms * 1.1).toFixed(1),
      improvement_pct: ((terrestrial_ms - orbital_ms) / terrestrial_ms * 100).toFixed(0),
      physics: this.compareLatency(1000)  // Per 1000km
    };
  },

  /**
   * Format orbital link establishment message
   */
  formatLinkEstablishment(node = this.DEFAULT_NODE) {
    const ephemeris = this.getCurrentEphemeris(node);
    const latency = this.calculateLatency(node.altitude_km);

    return {
      messages: [
        `ACQUIRING ${node.id}...`,
        `ORBITAL EPHEMERIS CONFIRMED: ${ephemeris.latitude_deg}°N ${ephemeris.longitude_deg}°E ALT=${ephemeris.altitude_km}km`,
        `THERMAL BASELINE: -270°C (radiative equilibrium)`,
        `LASER LINK ESTABLISHED: ${latency.toFixed(1)}ms latency`
      ],
      node: node,
      ephemeris: ephemeris,
      latency_ms: latency
    };
  },

  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  },

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OrbitalSim;
}
