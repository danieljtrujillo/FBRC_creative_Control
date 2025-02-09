class LightingSetup {
    constructor(scene) {
        this.scene = scene;
        this.setupLights();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);

        // Back light
        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(0, 3, -5);
        this.scene.add(backLight);
    }

    adjustLightIntensity(lightIndex, intensity) {
        const lights = this.scene.children.filter(child => child instanceof THREE.Light);
        if (lights[lightIndex]) {
            lights[lightIndex].intensity = intensity;
        }
    }
}
