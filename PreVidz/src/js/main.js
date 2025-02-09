let sceneManager;
let animationController;
let recordingManager;

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', onWindowResize);

function init() {
    sceneManager = new SceneManager('scene-container');
    animationController = new AnimationController(sceneManager);
    recordingManager = new RecordingManager(sceneManager.renderer, sceneManager.scene, sceneManager.activeCamera);

    setupEventListeners();
    loadDefaultModel();
    animate();
}

function loadDefaultModel() {
    const modelLoader = new ModelLoader();
    modelLoader.load('assets/models/character.glb', (gltf) => {
        sceneManager.addModel(gltf);
        animationController.setModel(gltf);
    });
}

function setupEventListeners() {
    document.getElementById('play-btn').addEventListener('click', () => animationController.play());
    document.getElementById('pause-btn').addEventListener('click', () => animationController.pause());
    document.getElementById('stop-btn').addEventListener('click', () => animationController.stop());
    
    document.getElementById('record-btn').addEventListener('click', () => {
        if (!recordingManager.isRecording) {
            recordingManager.startRecording();
            document.getElementById('record-btn').classList.add('recording');
            document.getElementById('save-btn').disabled = true;
        } else {
            recordingManager.stopRecording();
            document.getElementById('record-btn').classList.remove('recording');
            document.getElementById('save-btn').disabled = false;
        }
    });
    
    document.getElementById('save-btn').addEventListener('click', () => {
        recordingManager.save();
        document.getElementById('save-btn').disabled = true;
    });

    document.getElementById('camera-select').addEventListener('change', (e) => {
        sceneManager.switchCamera(e.target.value);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (animationController.isPlaying) {
        animationController.update();
    }
    
    if (recordingManager.isRecording) {
        recordingManager.capture();
    }
    
    sceneManager.render();
}

function onWindowResize() {
    sceneManager.onWindowResize();
}