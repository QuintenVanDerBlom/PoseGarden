import { useState, useEffect } from 'react';

function ModelController({ poseData, setPrediction }) {
    const [neuralNetwork, setNeuralNetwork] = useState(null);
    const [status, setStatus] = useState('Loading model...');
    const [detectedSign, setDetectedSign] = useState('');

    useEffect(() => {
        if (window.ml5) {
            const nn = window.ml5.neuralNetwork({ task: 'classification' });
            console.log('Attempting to load model...');

            const files = {
                model: '/hand-sign-model/model.json',
                weights: '/hand-sign-model/model.weights.bin',
                metadata: '/hand-sign-model/model_meta.json',
            };

            Promise.all(
                Object.entries(files).map(([key, url]) =>
                    fetch(url)
                        .then(response => {
                            if (!response.ok) throw new Error(`HTTP error for ${key}: ${response.status}`);
                            return key === 'weights' ? response.blob() : response.text();
                        })
                        .then(data => {
                            if (key !== 'weights') {
                                JSON.parse(data);
                                console.log(`${key} is valid JSON`);
                            } else {
                                console.log(`${key} fetched as blob, size: ${data.size} bytes`);
                            }
                        })
                        .catch(err => console.error(`Fetch error for ${key} (${url}):`, err))
                )
            )
                .then(() => {
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
                })
                .catch(err => {
                    setStatus('Error fetching model files');
                    console.error('Fetch failed:', err);
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
                    setDetectedSign('');
                } else {
                    const label = results[0].label;
                    const confidence = (results[0].confidence * 100).toFixed(2);
                    setPrediction(label);
                    setStatus('Model loaded');
                    setDetectedSign(`${label} (${confidence}%)`);
                }
            });
        } else if (poseData.length === 0) {
            setDetectedSign('No hand detected');
        }
    }, [poseData, neuralNetwork, setPrediction]);

    // Hand signal index data
    const handSignals = [
        { gesture: 'Peace Sign ✌️', action: 'Plant' },
        { gesture: 'Fist ✊', action: 'Water' },
        { gesture: 'Open Hand 🖐️', action: 'Fertilize' },
        { gesture: 'OK Signal 👌', action: 'Harvest' },
    ];

    // Game steps
    const gameSteps = [
        'Plant (Seed)',
        'Water (Growing)',
        'Fertilize (Teen)',
        'Water (Mature)',
        'Harvest (Adult)',
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-700 text-sm">{status}</p>
            <p className="text-green-600 text-lg font-semibold mt-2">
                {detectedSign || 'Waiting for hand sign...'}
            </p>
            {/* Hand Signal Index */}
            <div className="mt-4">
                <h3 className="text-gray-800 text-sm font-medium">Hand Signals:</h3>
                <ul className="mt-2 text-gray-600 text-xs space-y-1">
                    {handSignals.map((signal, index) => (
                        <li key={index}>
                            {signal.gesture} = {signal.action}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Game Steps */}
            <div className="mt-4">
                <h3 className="text-gray-800 text-sm font-medium">Game Steps:</h3>
                <ol className="mt-2 text-gray-600 text-xs space-y-1 list-decimal list-inside">
                    {gameSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default ModelController;