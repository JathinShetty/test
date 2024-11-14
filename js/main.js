import { createScene } from './scene.js';
import { setupLights } from './lights.js';
import { loadHDRI, loadingManager } from './loaders.js';
import { createMaterials } from './materials.js';

async function init() {
    // Create scene and get references
    const scene = createScene();
    const camera = scene.camera;
    const renderer = scene.renderer;
    const controls = scene.controls;

    // Show loading screen
    const loadingElement = document.getElementById('loading');
    loadingManager.onProgress = (url, loaded, total) => {
        const progress = (loaded / total * 100).toFixed(0);
        loadingElement.textContent = `Loading... ${progress}%`;
    };

    loadingManager.onLoad = () => {
        loadingElement.style.display = 'none';
    };

    try {
        // Load HDR environment
        const envMap = await loadHDRI();
        scene.environment = envMap;
        scene.background = envMap;

        // Set up lights after environment is loaded
        const lights = setupLights(scene);

        // Create materials and objects
        createMaterials(scene, envMap);

        // Setup GUI controls
        const gui = new dat.GUI();
        
        // Lighting controls
        const lightingFolder = gui.addFolder('Lighting');
        lightingFolder.add(renderer, 'toneMappingExposure', 0, 2, 0.1).name('Exposure');
        lightingFolder.add(lights.directionalLight, 'intensity', 0, 2, 0.1).name('Sun Intensity');
        lightingFolder.add(lights.ambientLight, 'intensity', 0, 1, 0.1).name('Ambient Intensity');
        lightingFolder.open();

        // Environment controls
        const envFolder = gui.addFolder('Environment');
        const envConfig = {
            backgroundIntensity: 1,
            envMapIntensity: 1
        };
        
        envFolder.add(envConfig, 'backgroundIntensity', 0, 2, 0.1)
            .onChange(value => {
                scene.background = envMap.clone();
                scene.background.intensity = value;
            });
        
        envFolder.add(envConfig, 'envMapIntensity', 0, 2, 0.1)
            .onChange(value => {
                scene.environment = envMap.clone();
                scene.environment.intensity = value;
            });
        envFolder.open();

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        
        animate();

    } catch (error) {
        console.error('Error initializing scene:', error);
        loadingElement.textContent = 'Error loading scene. Please refresh.';
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (scene.camera && scene.renderer) {
        scene.camera.aspect = window.innerWidth / window.innerHeight;
        scene.camera.updateProjectionMatrix();
        scene.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize the application
init();