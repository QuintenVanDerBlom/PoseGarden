import HandDetector from './components/HandDetector';
import GameCanvas from './components/GameCanvas';
import ModelController from './components/ModelController';
import { useState } from 'react';

function App() {
    const [poseData, setPoseData] = useState([]);
    const [prediction, setPrediction] = useState(null);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-6">
                <h1 className="text-3xl font-bold text-center text-green-700">Pixel Plant Game</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative w-full max-w-md mx-auto aspect-[16/9] bg-gray-200 rounded-lg shadow-lg">
                        <HandDetector onPoseDataUpdate={setPoseData} />
                    </div>
                    <div className="w-full max-w-md mx-auto aspect-[16/9] bg-gray-300 rounded-lg shadow-lg">
                        <GameCanvas prediction={prediction} />
                    </div>
                </div>
                <ModelController poseData={poseData} setPrediction={setPrediction} />
            </div>
        </div>
    );
}

export default App;