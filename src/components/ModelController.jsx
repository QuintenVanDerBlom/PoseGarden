import { useState, useEffect } from 'react';

function ModelController({ poseData, setPrediction }) {
    const [neuralNetwork, setNeuralNetwork] = useState(null);
    const [status, setStatus] = useState('Loading model...');

    useEffect(() => {
        if (window.ml5) {
            const nn = window.ml5.neuralNetwork({ task: 'classification' });
            console.log('Attempting to load model...');

            const files = {
                model: '/hand-sign-model/model.json',
                weights: '/hand-sign-model/model.weights.bin',
                metadata: '/hand-sign-model/model_meta.json',
            };

            // Debug each file fetch
            Object.entries(files).forEach(([key, url]) => {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error for ${key}: ${response.status}`);
                        }
                        return key === 'weights' ? response.blob() : response.text();
                    })
                    .then(data => {
                        console.log(`Response for ${key} (${url}):`, data);
                        if (key !== 'weights') {
                            try {
                                JSON.parse(data);
                                console.log(`${key} is valid JSON`);
                            } catch (e) {
                                console.error(`JSON parse error for ${key}:`, e);
                            }
                        } else {
                            console.log(`${key} fetched as blob, size: ${data.size} bytes`);
                        }
                    })
                    .catch(err => console.error(`Fetch error for ${key}:`, err));
            });

            nn.load(files, (err) => {
                if (err) {
                    setStatus('Error loading model');
                    console.error('Model load error:', err);
                } else {
                    setNeuralNetwork(nn);
                    setStatus('Model loaded');
                    console.log('Model loaded successfully');
                }
            });
        } else {
            setStatus('ml5 not available');
            console.error('ml5 not found');
        }
    }, []);

    const normalizePoseData = (pose) => {
        const features = [];
        pose.forEach(hand => {
            hand.forEach(landmark => {
                features.push(landmark.x, landmark.y, landmark.z);
            });
        });
        return features;
    };

    useEffect(() => {
        if (neuralNetwork && poseData.length > 0) {
            const features = normalizePoseData(poseData);
            neuralNetwork.classify(features, (error, results) => {
                if (error) {
                    setStatus('Prediction error');
                    console.error('Prediction error:', error);
                } else {
                    setPrediction(results[0].label);
                    setStatus(`Detected: ${results[0].label} (${(results[0].confidence * 100).toFixed(2)}%)`);
                }
            });
        }
    }, [poseData, neuralNetwork, setPrediction]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-700">{status}</p>
        </div>
    );
}

export default ModelController;