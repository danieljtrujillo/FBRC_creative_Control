class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.setupRenderer();
        this.setupCameras();
        this.setupLighting();
        this.setupControls();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.container.appendChild(this.renderer.domElement);
    }

    setupCameras() {
        this.cameras = {
            main: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
            side: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
            top: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        };

        // Set up camera positions
        this.cameras.main.position.set(0, 1.6, 4);
        this.cameras.side.position.set(4, 1.6, 0);
        this.cameras.top.position.set(0, 4, 0);
        this.cameras.top.lookAt(0, 0, 0);

        this.activeCamera = this.cameras.main;
    }

    setupLighting() {
        // Key Light
        this.keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.keyLight.position.set(-2, 3, 2);
        this.keyLight.castShadow = true;
        this.scene.add(this.keyLight);

        // Fill Light
        this.fillLight = new THREE.DirectionalLight(0x7ec0ee, 0.5);
        this.fillLight.position.set(2, 2, -2);
        this.scene.add(this.fillLight);

        // Back Light
        this.backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        this.backLight.position.set(0, 2, -3);
        this.scene.add(this.backLight);

        // Ambient Light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(this.ambientLight);

        // Configure shadow properties
        this.keyLight.shadow.mapSize.width = 2048;
        this.keyLight.shadow.mapSize.height = 2048;
        this.keyLight.shadow.camera.near = 0.5;
        this.keyLight.shadow.camera.far = 500;
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.activeCamera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    addModel(gltf) {
        this.model = gltf.scene;
        this.model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        this.scene.add(this.model);

        // Add a ground plane
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    switchCamera(cameraType) {
        this.activeCamera = this.cameras[cameraType];
        this.controls.object = this.activeCamera;
    }

    onWindowResize() {
        Object.values(this.cameras).forEach(camera => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.activeCamera);
    }
}