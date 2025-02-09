class AnimationController {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.animations = [];
        this.mixer = null;
        this.currentAction = null;
        this.isPlaying = false;
        this.clock = new THREE.Clock();
    }

    setModel(gltf) {
        if (gltf.animations.length) {
            this.mixer = new THREE.AnimationMixer(gltf.scene);
            this.animations = gltf.animations;
            
            // Create animation actions
            this.actions = {};
            this.animations.forEach(animation => {
                const action = this.mixer.clipAction(animation