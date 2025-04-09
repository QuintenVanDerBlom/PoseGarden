import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const videoConstraints = { width: 480, height: 270, facingMode: 'user' };

function HandDetector({ onPoseDataUpdate }) {
    const webcamRef = useRef(null);
    const landmarkerRef = useRef(null);

    const capture = async () => {
        if (webcamRef.current && landmarkerRef.current && webcamRef.current.getCanvas()) {
            const video = webcamRef.current.video;
            if (video.currentTime > 0) {
                const result = await landmarkerRef.current.detectForVideo(video, performance.now());
                if (result.landmarks) {
                    onPoseDataUpdate(result.landmarks);
                }
            }
        }
        requestAnimationFrame(capture);
    };

    useEffect(() => {
        const createHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm');
            const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                numHands: 2,
            });
            landmarkerRef.current = handLandmarker;
            capture();
        };
        createHandLandmarker();
    }, []);

    return (
        <Webcam
            width="480"
            height="270"
            mirrored
            audio={false}
            videoConstraints={videoConstraints}
            ref={webcamRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
    );
}

export default HandDetector;