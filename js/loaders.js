import * as THREE from 'three';

// Create a loading manager to track all loading processes
export const loadingManager = new THREE.LoadingManager();

// HDR Environment maps collection
const HDR_MAPS = {
    venice: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr',
    footprint: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/footprint_court_2k.hdr',
    royal: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/royal_esplanade_1k.hdr'
};

// Function to load HDR environment map
export async function loadHDRI(mapName = 'venice') {
    const rgbeLoader = new THREE.RGBELoader(loadingManager);
    
    // Configure loader
    rgbeLoader.setDataType(THREE.FloatType);

    try {
        const texture = await rgbeLoader.loadAsync(HDR_MAPS[mapName] || HDR_MAPS.venice);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        
        // Set default intensity
        texture.intensity = 1.0;

        return texture;
    } catch (error) {
        console.error('Error loading HDR environment map:', error);
        throw error;
    }
}

// Texture loader for regular textures
export const textureLoader = new THREE.TextureLoader(loadingManager);

// Load regular texture with error handling
export async function loadTexture(url) {
    try {
        const texture = await textureLoader.loadAsync(url);
        return texture;
    } catch (error) {
        console.error('Error loading texture:', error);
        throw error;
    }
}

// Helper function to load multiple textures
export async function loadTextures(urls) {
    try {
        const promises = urls.map(url => loadTexture(url));
        return await Promise.all(promises);
    } catch (error) {
        console.error('Error loading textures:', error);
        throw error;
    }
}

// Load cube texture maps
export async function loadCubeMap(urls) {
    return new Promise((resolve, reject) => {
        const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
        
        cubeTextureLoader.load(urls,
            // onLoad
            (cubeTexture) => {
                resolve(cubeTexture);
            },
            // onProgress
            undefined,
            // onError
            (error) => {
                console.error('Error loading cube map:', error);
                reject(error);
            }
        );
    });
}

// Helper function to pre-load all environment maps
export async function preloadEnvironmentMaps() {
    const maps = {};
    try {
        await Promise.all(
            Object.entries(HDR_MAPS).map(async ([name, url]) => {
                maps[name] = await loadHDRI(name);
            })
        );
        return maps;
    } catch (error) {
        console.error('Error preloading environment maps:', error);
        throw error;
    }
}

// Helper function to switch environment maps
export function switchEnvironmentMap(scene, mapName) {
    loadHDRI(mapName).then(envMap => {
        scene.environment = envMap;
        scene.background = envMap;
    }).catch(error => {
        console.error('Error switching environment map:', error);
    });
}