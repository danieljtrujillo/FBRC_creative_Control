class CameraManager {
    constructor(container) {
        this.container = container;
        this.cameras = new Map();
        this.currentCamera = null;
        this.setupCameras();
    }

    setupCameras() {
        const aspect = this.container.clientWidth / this.container.clientHeight;

        // Main camera
        const mainCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        mainCamera.position.set(0, 2, 5);
        this.cameras.set('main', mainCamera);

        // Side view camera
        const sideCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        sideCamera.position.set(5, 2, 0);
        sideCamera.lookAt(0, 0, 0);
        this.cameras.set('side', sideCamera);

        // Top view camera
        const topCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        topCamera.position.set(0, 5, 0);
        topCamera.lookAt(0, 0, 0);
        this.cameras.set('top', topCamera);

        this.currentCamera = mainCamera;
    }

    switchCamera(cameraName) {
        const camera = this.cameras.get(cameraName);
        if (camera) {
            this.currentCamera = camera;
            return camera;
        }
        return null;
    }

    getCurrentCamera() {
        return this.currentCamera;
    }

    updateAspect(width, height) {
        this.cameras.forEach(camera => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }
}
