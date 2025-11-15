// Create the Scene - root container for all 3D objects
const scene = new THREE.Scene();

// Create a PerspectiveCamera
// fov ~60, aspect based on window size, near 0.1, far 1000
// Positioned as if a person is standing near a desk
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(-1.2, 1.1, 0.1);

// Create the WebGL renderer with antialiasing for smoother edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Optionally set pixel ratio for crisp rendering on high-DPI screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
// Add the canvas to the document
document.body.appendChild(renderer.domElement);

// Update camera and renderer when the window is resized
function onWindowResize() {
    // Update camera aspect and projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Resize the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
}
window.addEventListener('resize', onWindowResize, false);

// Basic animation / render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
// Build a simple rectangular dorm room and add it to the scene.
// Keeps the camera inside (camera position [-1.5,1.4,2.8] was considered).
function buildRoom() {
    // Room dimensions (choose values so the existing camera sits well inside)
    const roomWidth = 6;    // x extent (left to right)
    const roomDepth = 8;    // z extent (back to front)
    const roomHeight = 2.6; // y extent (floor to ceiling)

    // Neutral, soft materials for floor, walls, ceiling.
    // Use DoubleSide so planes are visible from inside the room.
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xded8d0, side: THREE.DoubleSide });
    const wallMat  = new THREE.MeshStandardMaterial({ color: 0xefeae2, side: THREE.DoubleSide });
    const ceilMat  = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide });

    // FLOOR
    // PlaneGeometry is created in the XY plane facing +Z by default.
    // Rotate -90deg around X to make it horizontal (XZ plane) with normal pointing up (+Y).
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2; // lay flat
    floor.position.set(0, 0, 0);     // y = 0 is the floor level
    scene.add(floor);

    // CEILING (optional)
    // Place at roomHeight, rotated to face downward.
    const ceilGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;      // face down into the room
    ceiling.position.set(0, roomHeight, 0);
    scene.add(ceiling);

    // BACK WALL (at negative Z)
    // Plane default faces +Z, so placing it at z = -depth/2 will have it face into the room.
    const backGeo = new THREE.PlaneGeometry(roomWidth, roomHeight);
    const backWall = new THREE.Mesh(backGeo, wallMat);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    // No rotation needed: default plane lies in XY, normal +Z, so it faces the interior.
    scene.add(backWall);

    // FRONT WALL (at positive Z) - this is the wall that will have the window.
    // Place at z = +depth/2. Using DoubleSide means it's visible from inside; rotate if you want a single visible side.
    const frontGeo = new THREE.PlaneGeometry(roomWidth, roomHeight);
    const frontWall = new THREE.Mesh(frontGeo, wallMat);
    frontWall.position.set(0, roomHeight / 2, roomDepth / 2);
    // Keep as-is (DoubleSide ensures visibility from inside even if normal points outward).
    scene.add(frontWall);

    // LEFT WALL (at negative X)
    // Rotate +90deg around Y so the plane's +Z normal becomes +X (facing into the room).
    const leftGeo = new THREE.PlaneGeometry(roomDepth, roomHeight);
    const leftWall = new THREE.Mesh(leftGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    // Note: plane geometry width is roomDepth so the left/right walls span front-to-back.
    scene.add(leftWall);

    // RIGHT WALL (at positive X)
    // Rotate -90deg around Y so the plane's +Z normal becomes -X (facing into the room).
    const rightGeo = new THREE.PlaneGeometry(roomDepth, roomHeight);
    const rightWall = new THREE.Mesh(rightGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    scene.add(rightWall);

    // Basic lighting so MeshStandardMaterial is visible
    const amb = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(3, 6, 4);
    scene.add(dir);

    // Small helper grid on the floor (optional, remove if not wanted)
    const grid = new THREE.GridHelper(Math.max(roomWidth, roomDepth), 10, 0xaaaaaa, 0xdddddd);
    grid.position.y = 0.01; // slightly above floor to avoid z-fighting
    scene.add(grid);
}

// Build the room into the current scene
buildRoom();


