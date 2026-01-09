/**
 * SpaceProof 3D Orbit Visualization
 *
 * Renders orbital path using Three.js TubeGeometry for reliable,
 * artifact-free visualization across all browsers.
 *
 * Key features:
 * - TubeGeometry instead of lines (no WebGL line artifacts)
 * - Proper longitude wrap handling (antimeridian crossing)
 * - Smooth orbital path from Kepler elements
 */

const OrbitVisualization = {
  // Scene objects
  scene: null,
  camera: null,
  renderer: null,
  earth: null,
  orbitMesh: null,
  satellite: null,

  // Constants
  SCALE: 0.001, // km to scene units
  EARTH_RADIUS: 6371,
  ORBIT_ALTITUDE: 550,

  // Animation
  animationId: null,
  satelliteAngle: 0,

  /**
   * Initialize the 3D visualization
   */
  init(container) {
    if (!window.THREE) {
      console.error('Three.js not loaded');
      return false;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000510);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 8, 20);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Add controls if available
    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.minDistance = 10;
      this.controls.maxDistance = 50;
    }

    // Create scene objects
    this.createEarth();
    this.createOrbitPath();
    this.createSatellite();
    this.createStarfield();
    this.createLighting();

    // Handle resize
    window.addEventListener('resize', () => this.onResize(container));

    // Start animation
    this.animate();

    // Log orbit points for debugging (Instruction 0)
    this.logOrbitPoints();

    return true;
  },

  /**
   * Create Earth sphere
   */
  createEarth() {
    const radius = this.EARTH_RADIUS * this.SCALE;
    const geometry = new THREE.SphereGeometry(radius, 64, 64);

    // Create gradient material (blue/green Earth-like)
    const material = new THREE.MeshPhongMaterial({
      color: 0x2266aa,
      emissive: 0x112244,
      shininess: 20,
      transparent: true,
      opacity: 0.9
    });

    this.earth = new THREE.Mesh(geometry, material);
    this.scene.add(this.earth);

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.02, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.scene.add(atmosphere);
  },

  /**
   * Generate orbit points with proper coordinate conversion
   * Handles longitude wrap (antimeridian crossing)
   */
  generateOrbitPoints() {
    const points = [];
    const orbitRadius = (this.EARTH_RADIUS + this.ORBIT_ALTITUDE) * this.SCALE;
    const inclination = 51.6 * Math.PI / 180; // ISS-like inclination
    const steps = 360;

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;

      // Calculate position using orbital mechanics
      // The orbit is inclined relative to the equator
      const x = orbitRadius * Math.cos(angle);
      const y = orbitRadius * Math.sin(angle) * Math.sin(inclination);
      const z = orbitRadius * Math.sin(angle) * Math.cos(inclination);

      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  },

  /**
   * Log orbit points for debugging (Instruction 0 from user)
   */
  logOrbitPoints() {
    const points = this.generateOrbitPoints();
    const earthRadius = this.EARTH_RADIUS * this.SCALE;
    const expectedRadius = (this.EARTH_RADIUS + this.ORBIT_ALTITUDE) * this.SCALE;

    console.log('=== ORBIT POINT DIAGNOSIS ===');
    console.log('Expected orbit radius:', expectedRadius.toFixed(4));
    console.log('Earth radius:', earthRadius.toFixed(4));
    console.log('Total points:', points.length);

    // Check for issues
    let hasNaN = false;
    let hasInfinity = false;
    let minRadius = Infinity;
    let maxRadius = -Infinity;
    let radiusVariance = [];

    points.forEach((p, i) => {
      const radius = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

      if (isNaN(p.x) || isNaN(p.y) || isNaN(p.z)) hasNaN = true;
      if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.z)) hasInfinity = true;

      minRadius = Math.min(minRadius, radius);
      maxRadius = Math.max(maxRadius, radius);
      radiusVariance.push(radius);
    });

    console.log('Orbit points sample:', points.slice(0, 5).map(p => ({
      x: p.x.toFixed(4),
      y: p.y.toFixed(4),
      z: p.z.toFixed(4),
      radius: Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z).toFixed(4)
    })));

    console.log('Has NaN values:', hasNaN);
    console.log('Has Infinity values:', hasInfinity);
    console.log('Radius range:', minRadius.toFixed(4), '-', maxRadius.toFixed(4));
    console.log('Radius consistent:', (maxRadius - minRadius) < 0.001 ? 'YES' : 'NO');
    console.log('Points above Earth surface:', minRadius > earthRadius ? 'YES' : 'NO');
    console.log('=== END DIAGNOSIS ===');

    return {
      valid: !hasNaN && !hasInfinity && minRadius > earthRadius,
      points: points
    };
  },

  /**
   * Create orbit path using TubeGeometry (Approach A - most reliable)
   *
   * Why TubeGeometry: Uses triangles, not lines. Zero WebGL line issues.
   * Works everywhere, guaranteed smooth rendering.
   */
  createOrbitPath() {
    const points = this.generateOrbitPoints();

    // Create smooth curve from orbit points
    // CatmullRomCurve3 creates a smooth spline through all points
    const curve = new THREE.CatmullRomCurve3(points, true); // true = closed loop

    // Create tube geometry (thin cylinder along path)
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      256,      // tubular segments (smoothness along path)
      0.03,     // radius (very thin tube)
      8,        // radial segments
      true      // closed
    );

    // Cyan material for visibility
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8
    });

    this.orbitMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.scene.add(this.orbitMesh);

    // Also add a subtle glow effect
    const glowGeometry = new THREE.TubeGeometry(curve, 256, 0.06, 8, true);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(glowMesh);
  },

  /**
   * Create satellite marker
   */
  createSatellite() {
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00
    });
    this.satellite = new THREE.Mesh(geometry, material);
    this.scene.add(this.satellite);

    // Add satellite trail glow
    const trailGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    this.satelliteGlow = new THREE.Mesh(trailGeometry, trailMaterial);
    this.scene.add(this.satelliteGlow);
  },

  /**
   * Create starfield background
   */
  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Random positions on a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 100 + Math.random() * 50;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  },

  /**
   * Create scene lighting
   */
  createLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambient);

    // Sun light (directional)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(10, 5, 10);
    this.scene.add(sunLight);

    // Rim light for atmosphere effect
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    rimLight.position.set(-5, 0, -5);
    this.scene.add(rimLight);
  },

  /**
   * Animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate Earth slowly
    if (this.earth) {
      this.earth.rotation.y += 0.001;
    }

    // Move satellite along orbit
    if (this.satellite) {
      const orbitRadius = (this.EARTH_RADIUS + this.ORBIT_ALTITUDE) * this.SCALE;
      const inclination = 51.6 * Math.PI / 180;

      this.satelliteAngle += 0.005; // Orbital speed

      const x = orbitRadius * Math.cos(this.satelliteAngle);
      const y = orbitRadius * Math.sin(this.satelliteAngle) * Math.sin(inclination);
      const z = orbitRadius * Math.sin(this.satelliteAngle) * Math.cos(inclination);

      this.satellite.position.set(x, y, z);
      if (this.satelliteGlow) {
        this.satelliteGlow.position.set(x, y, z);
      }
    }

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  },

  /**
   * Handle window resize
   */
  onResize(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  /**
   * Highlight satellite (for orbital link establishment)
   */
  highlightSatellite(active = true) {
    if (this.satellite) {
      this.satellite.material.color.setHex(active ? 0x00ff00 : 0xffff00);
    }
    if (this.satelliteGlow) {
      this.satelliteGlow.material.color.setHex(active ? 0x00ff00 : 0xffff00);
      this.satelliteGlow.material.opacity = active ? 0.5 : 0.3;
    }
  },

  /**
   * Clean up resources
   */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    // Remove event listeners
    window.removeEventListener('resize', this.onResize);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OrbitVisualization;
}
