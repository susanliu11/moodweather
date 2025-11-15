
// Import Three.js (assuming it's available via module or CDN)

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(); // Light grey background

// Set up camera (perspective view)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a group to hold all room objects (floor, walls, ceiling, props)
const roomGroup = new THREE.Group();
scene.add(roomGroup);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
// Add ambient light for general illumination throughout the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

// Add directional light to simulate sunlight from the window
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load the room model using GLTFLoader
const loader = new THREE.GLTFLoader();
loader.load('assets/room.glb', (gltf) => {
    const room = gltf.scene;
    
    // Adjust scale if the model is too large or small
    // room.scale.set(1, 1, 1); // Multiply by a factor to resize (e.g., 0.5 for half size)
    
    // Adjust position if needed
    // room.position.set(0, 0, 0); // Move the model (x, y, z coordinates)
    
    roomGroup.add(room);
}, undefined, (error) => {
    console.error('Error loading room model:', error);
});

// Create a simple desk (brown box)
const deskGeometry = new THREE.BoxGeometry(2, 0.1, 1);
const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const desk = new THREE.Mesh(deskGeometry, deskMaterial);
desk.position.set(-2, 0.5, -2);
desk.castShadow = true;
roomGroup.add(desk);

// Create a simple chair (red box with smaller dimensions)
const chairGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.6);
const chairMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const chair = new THREE.Mesh(chairGeometry, chairMaterial);
chair.position.set(-1.5, 0.4, -1.5);
chair.castShadow = true;
roomGroup.add(chair);

// Create a simple bed (blue box)
const bedGeometry = new THREE.BoxGeometry(1.5, 0.3, 2.5);
const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
const bed = new THREE.Mesh(bedGeometry, bedMaterial);
bed.position.set(2, 0.3, 0);
bed.castShadow = true;
roomGroup.add(bed);

// Create a simple nightstand (small yellow box)
const nightstandGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.5);
const nightstandMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
const nightstand = new THREE.Mesh(nightstandGeometry, nightstandMaterial);
nightstand.position.set(3, 0.3, 1.5);
nightstand.castShadow = true;
roomGroup.add(nightstand);

// Main animation loop - runs every frame for smooth animation
function animate() {
    // Schedule the next frame
    requestAnimationFrame(animate);
    
    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// Start the animation loop
animate();