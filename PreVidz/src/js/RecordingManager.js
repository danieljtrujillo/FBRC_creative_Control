class RecordingManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.capturer = null;
        this.isRecording = false;
        this.setupCapturer();
    }

    setupCapturer() {
        this.capturer = new CCapture({
            format: 'webm',
            framerate: 60,
            verbose: true
        });
    }

    startRecording() {
        if (!this.isRecording) {
            this.capturer.start();
            this.isRecording = true;
            console.log('Recording started');
        }
    }

    stopRecording() {
        if (this.isRecording) {
            this.capturer.stop();
            this.isRecording = false;
            console.log('Recording stopped');
            this.capturer.save((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'animation.webm';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }
    }

    capture() {
        if (this.isRecording) {
            this.capturer.capture(this.renderer.domElement);
        }
    }

    isCurrentlyRecording() {
        return this.isRecording;
    }
}
