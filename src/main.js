// ----- Three.js Solar System Simulation Script -----
// (Assumes that Three.js and OrbitControls are already loaded.)

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ----- Scene, Camera, and Renderer -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(0, 50, 150);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----- OrbitControls -----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ----- Lights (Planets Even Brighter & Sun Almost White) -----
// Increased ambient and point light intensities for brighter planets.
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased from 0.6 to 1.0
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 12, 1500); // Increased intensity from 8 to 12
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// ----- Orbit Lines Toggle UI -----
// Global array to store orbit lines.
const orbitLines = [];

const orbitToggle = document.createElement('input');
orbitToggle.type = 'checkbox';
orbitToggle.checked = true;
orbitToggle.style.position = 'absolute';
orbitToggle.style.top = '60px';
orbitToggle.style.left = '10px';
document.body.appendChild(orbitToggle);

const orbitToggleLabel = document.createElement('div');
orbitToggleLabel.innerHTML = 'Show Orbit Lines';
orbitToggleLabel.style.position = 'absolute';
orbitToggleLabel.style.top = '60px';
orbitToggleLabel.style.left = '30px';
orbitToggleLabel.style.color = '#ffffff';
document.body.appendChild(orbitToggleLabel);

orbitToggle.addEventListener('change', () => {
  orbitLines.forEach(line => (line.visible = orbitToggle.checked));
});

// ----- Simulation Speed Slider -----
// Maximum value increased to 50 with step of 0.5.
let simulationSpeed = 1;
const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = 0.1;
speedSlider.max = 50;
speedSlider.step = 0.5;
speedSlider.value = simulationSpeed;
speedSlider.style.position = 'absolute';
speedSlider.style.top = '10px';
speedSlider.style.left = '10px';
document.body.appendChild(speedSlider);

const speedLabel = document.createElement('div');
speedLabel.innerHTML = `Simulation Speed: ${simulationSpeed}`;
speedLabel.style.position = 'absolute';
speedLabel.style.top = '30px';
speedLabel.style.left = '10px';
speedLabel.style.color = '#ffffff';
document.body.appendChild(speedLabel);

speedSlider.addEventListener('input', (e) => {
  simulationSpeed = parseFloat(e.target.value);
  speedLabel.innerHTML = `Simulation Speed: ${simulationSpeed}`;
});

// ----- Popover for Hover Info -----
const popover = document.createElement('div');
popover.style.position = 'absolute';
popover.style.background = 'rgba(0, 0, 0, 0.7)';
popover.style.color = '#fff';
popover.style.padding = '8px';
popover.style.borderRadius = '4px';
popover.style.pointerEvents = 'none';
popover.style.display = 'none';
document.body.appendChild(popover);

// ----- Star Field Background -----
const starsCount = 1000;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i++) {
  starsPositions[i * 3] = (Math.random() - 0.5) * 2000;
  starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
  starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1, sizeAttenuation: true });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// ----- Solar System Data -----
const solarSystemData = {
  sun: {
    name: "Sun",
    description: "The star at the center of our solar system.",
    radius: 5,
    color: 0xffffff, // Almost white
  },
  planets: [
    {
      name: "Mercury",
      description: "Closest planet to the Sun.",
      distance: 10,
      radius: 0.38,
      orbitSpeed: 0.04,
      rotationSpeed: 0.02,
      color: 0xaaaaaa,
      moons: [],
    },
    {
      name: "Venus",
      description: "Second planet from the Sun.",
      distance: 15,
      radius: 0.95,
      orbitSpeed: 0.035,
      rotationSpeed: 0.02,
      color: 0xdaa520,
      moons: [],
    },
    {
      name: "Earth",
      description: "Our home planet.",
      distance: 20,
      radius: 1,
      orbitSpeed: 0.03,
      rotationSpeed: 0.03,
      color: 0x0000ff,
      moons: [
        {
          name: "Moon",
          description: "Earth's only natural satellite.",
          distance: 2.5,
          radius: 0.27,
          orbitSpeed: 0.1,
          rotationSpeed: 0.05,
          color: 0x888888,
        },
      ],
    },
    {
      name: "Mars",
      description: "The red planet.",
      distance: 25,
      radius: 0.53,
      orbitSpeed: 0.025,
      rotationSpeed: 0.03,
      color: 0xff4500,
      moons: [
        {
          name: "Phobos",
          description: "One of Mars' moons.",
          distance: 1.5,
          radius: 0.1,
          orbitSpeed: 0.15,
          rotationSpeed: 0.1,
          color: 0x999999,
        },
        {
          name: "Deimos",
          description: "One of Mars' moons.",
          distance: 2.0,
          radius: 0.08,
          orbitSpeed: 0.12,
          rotationSpeed: 0.08,
          color: 0xaaaaaa,
        },
      ],
    },
    {
      name: "Jupiter",
      description: "The largest planet.",
      distance: 35,
      radius: 1.5,
      orbitSpeed: 0.02,
      rotationSpeed: 0.04,
      color: 0xffa500,
      moons: [
        {
          name: "Io",
          description: "Volcanically active moon.",
          distance: 2,
          radius: 0.3,
          orbitSpeed: 0.1,
          rotationSpeed: 0.05,
          color: 0xffff00,
        },
        {
          name: "Europa",
          description: "Icy surface moon.",
          distance: 2.5,
          radius: 0.28,
          orbitSpeed: 0.09,
          rotationSpeed: 0.05,
          color: 0xffffff,
        },
        {
          name: "Ganymede",
          description: "Largest moon in the solar system.",
          distance: 3,
          radius: 0.35,
          orbitSpeed: 0.08,
          rotationSpeed: 0.05,
          color: 0xdddddd,
        },
        {
          name: "Callisto",
          description: "Heavily cratered moon.",
          distance: 3.5,
          radius: 0.32,
          orbitSpeed: 0.07,
          rotationSpeed: 0.05,
          color: 0xbbbbbb,
        },
      ],
    },
    {
      name: "Saturn",
      description: "Known for its rings.",
      distance: 45,
      radius: 1.3,
      orbitSpeed: 0.017,
      rotationSpeed: 0.04,
      color: 0xf5deb3,
      moons: [
        {
          name: "Titan",
          description: "Largest moon of Saturn.",
          distance: 2.5,
          radius: 0.4,
          orbitSpeed: 0.1,
          rotationSpeed: 0.05,
          color: 0xffe4c4,
        },
      ],
      rings: { innerRadius: 1.5, outerRadius: 2.2, color: 0xaaaaaa },
    },
    {
      name: "Uranus",
      description: "An ice giant with a blue hue.",
      distance: 55,
      radius: 1.1,
      orbitSpeed: 0.015,
      rotationSpeed: 0.03,
      color: 0x66ccff,
      moons: [
        {
          name: "Miranda",
          description: "Small moon of Uranus.",
          distance: 1.5,
          radius: 0.2,
          orbitSpeed: 0.1,
          rotationSpeed: 0.05,
          color: 0xcccccc,
        },
      ],
    },
    {
      name: "Neptune",
      description: "Furthest known planet.",
      distance: 65,
      radius: 1.1,
      orbitSpeed: 0.013,
      rotationSpeed: 0.03,
      color: 0x00008b,
      moons: [
        {
          name: "Triton",
          description: "Largest moon of Neptune.",
          distance: 2,
          radius: 0.3,
          orbitSpeed: 0.1,
          rotationSpeed: 0.05,
          color: 0xaaaaaa,
        },
      ],
    },
  ],
};

// ----- Create the Sun -----
const sunGeometry = new THREE.SphereGeometry(solarSystemData.sun.radius, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: solarSystemData.sun.color });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.userData = {
  name: solarSystemData.sun.name,
  description: solarSystemData.sun.description,
};
scene.add(sunMesh);

// ----- Create Sun Particles (Corona Effect) -----
// Particles attached to the sun simulate a glowing corona.
const sunParticlesCount = 500;
const sunParticlesGeometry = new THREE.BufferGeometry();
const sunParticlesPositions = new Float32Array(sunParticlesCount * 3);
for (let i = 0; i < sunParticlesCount; i++) {
  const r = 7 + Math.random() * 3; // radius between 7 and 10
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  sunParticlesPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  sunParticlesPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  sunParticlesPositions[i * 3 + 2] = r * Math.cos(phi);
}
sunParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(sunParticlesPositions, 3));
const sunParticlesMaterial = new THREE.PointsMaterial({
  color: 0xffaa33,
  size: 0.2,
  transparent: true,
  opacity: 0.8,
});
const sunParticles = new THREE.Points(sunParticlesGeometry, sunParticlesMaterial);
sunMesh.add(sunParticles); // Attach to sun

// ----- Function to Create an Orbit Line -----
function createOrbitLine(distance) {
  const segments = 128;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * distance, 0, Math.sin(theta) * distance));
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
  const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  return orbitLine;
}

// ----- Create Planets (and Their Moons) -----
function createPlanet(planetData) {
  // Pivot for planet orbiting the Sun
  const planetPivot = new THREE.Object3D();
  scene.add(planetPivot);

  // Create the planet mesh
  const planetGeometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
  const planetMaterial = new THREE.MeshPhongMaterial({ color: planetData.color, shininess: 50 });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  planetMesh.position.x = planetData.distance;
  planetMesh.userData = {
    name: planetData.name,
    description: planetData.description,
  };
  planetPivot.add(planetMesh);

  // Add orbit line for this planet
  const orbitLine = createOrbitLine(planetData.distance);
  scene.add(orbitLine);
  orbitLines.push(orbitLine);
  planetData.orbitLine = orbitLine;

  // Add rings if defined (e.g., Saturn)
  if (planetData.rings) {
    const ringGeometry = new THREE.RingGeometry(planetData.rings.innerRadius, planetData.rings.outerRadius, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: planetData.rings.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    planetMesh.add(ringMesh);
  }

  // Create moons for the planet
  if (planetData.moons && planetData.moons.length > 0) {
    planetData.moons.forEach((moonData) => {
      const moonPivot = new THREE.Object3D();
      planetMesh.add(moonPivot);
      const moonGeometry = new THREE.SphereGeometry(moonData.radius, 32, 32);
      const moonMaterial = new THREE.MeshPhongMaterial({ color: moonData.color, shininess: 30 });
      const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
      moonMesh.position.x = moonData.distance;
      moonMesh.userData = {
        name: moonData.name,
        description: moonData.description,
      };
      moonPivot.add(moonMesh);
      moonData.pivot = moonPivot;
    });
  }

  planetData.pivot = planetPivot;
  planetData.planetMesh = planetMesh;
}

solarSystemData.planets.forEach((planetData) => {
  createPlanet(planetData);
});

// ----- Raycaster for Hover Interaction -----
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    if (intersected.userData && intersected.userData.name) {
      popover.style.display = 'block';
      popover.style.left = event.clientX + 10 + 'px';
      popover.style.top = event.clientY + 10 + 'px';
      popover.innerHTML = `<strong>${intersected.userData.name}</strong><br>${intersected.userData.description}`;
      return;
    }
  }
  popover.style.display = 'none';
}
window.addEventListener('mousemove', onMouseMove, false);

// ----- Handle Window Resize -----
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----- Animation Loop -----
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Rotate the Sun slowly
  sunMesh.rotation.y += 0.02 * simulationSpeed * delta;

  // Update each planet's orbit and rotation
  solarSystemData.planets.forEach((planetData) => {
    if (planetData.pivot) {
      planetData.pivot.rotation.y += planetData.orbitSpeed * simulationSpeed * delta;
    }
    if (planetData.planetMesh) {
      planetData.planetMesh.rotation.y += planetData.rotationSpeed * simulationSpeed * delta;
    }
    // Update moons' orbits and rotations
    if (planetData.moons && planetData.moons.length > 0) {
      planetData.moons.forEach((moonData) => {
        if (moonData.pivot) {
          moonData.pivot.rotation.y += moonData.orbitSpeed * simulationSpeed * delta;
        }
        if (moonData.pivot && moonData.pivot.children[0]) {
          moonData.pivot.children[0].rotation.y += moonData.rotationSpeed * simulationSpeed * delta;
        }
      });
    }
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();
