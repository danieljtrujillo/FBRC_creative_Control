class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.GLTFLoader();
    }

    loadModel(url) {
        return new Promise((resolve, reject) => {
            this.loader.load(url,
                (gltf) => {
                    this.scene.add(gltf.scene);
                    resolve(gltf);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('Error loading model:', error);
                    reject(error);
                }
            );
        });
    }
}
