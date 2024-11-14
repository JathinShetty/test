function createMetallicMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 1.0
    });
}

function createGlassMaterial() {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,
        thickness: 0.5,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.5
    });
}

function createPlasticMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 0x2194ce,
        metalness: 0.0,
        roughness: 0.3,
        envMapIntensity: 0.5
    });
}

function createFloorMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.0,
        roughness: 0.8,
        envMapIntensity: 0.5
    });
}