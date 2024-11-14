let scene, camera, renderer, controls;
let envMap;
const loadingManager = new THREE.LoadingManager();

// Initialize loading manager
loadingManager.onLoad = () => {
    document.getElementById('loading').style.display = 'none';
};

async function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load environment map
    const rgbeLoader = new THREE.RGBELoader(loadingManager);
    envMap = await rgbeLoader.loadAsync('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr');
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
    scene.background = envMap;

    // Add floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floor = new THREE.Mesh(floorGeometry, createFloorMaterial());
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add spheres
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    // Metallic sphere
    const metallicSphere = new THREE.Mesh(sphereGeometry, createMetallicMaterial());
    metallicSphere.position.set(-1.5, 0.5, 0);
    metallicSphere.castShadow = true;
    metallicSphere.receiveShadow = true;
    scene.add(metallicSphere);

    // Glass sphere
    const glassSphere = new THREE.Mesh(sphereGeometry, createGlassMaterial());
    glassSphere.position.set(0, 0.5, 0);
    glassSphere.castShadow = true;
    glassSphere.receiveShadow = true;
    scene.add(glassSphere);

    // Plastic sphere
    const plasticSphere = new THREE.Mesh(sphereGeometry, createPlasticMaterial());
    plasticSphere.position.set(1.5, 0.5, 0);
    plasticSphere.castShadow = true;
    plasticSphere.receiveShadow = true;
    scene.add(plasticSphere);

    // Setup lights
    setupLights(scene);

    // GUI controls
    const gui = new dat.GUI();
    const lightingFolder = gui.addFolder('Lighting');
    lightingFolder.add(renderer, 'toneMappingExposure', 0, 2, 0.1).name('Exposure');
    lightingFolder.open();

    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize the scene
init();