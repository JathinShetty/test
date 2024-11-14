function setupLights(scene) {
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    
    // Improve shadow quality
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.bias = -0.0001;
    
    scene.add(directionalLight);

    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Add some fill lights for better illumination
    const fillLight1 = new THREE.PointLight(0xffffff, 0.5);
    fillLight1.position.set(-5, 3, -5);
    scene.add(fillLight1);

    const fillLight2 = new THREE.PointLight(0xffffff, 0.5);
    fillLight2.position.set(5, 3, -5);
    scene.add(fillLight2);

    return {
        directionalLight,
        ambientLight,
        fillLight1,
        fillLight2
    };
}