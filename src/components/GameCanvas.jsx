import { useEffect, useRef, useState } from 'react';
import plantImg from '../assets/plant.png';
import waterImg from '../assets/water.png';
import fertilizerImg from '../assets/fertilizer.png';
import harvestImg from '../assets/harvest.png';

function GameCanvas({ prediction }) {
    const canvasRef = useRef(null);
    const [plantStage, setPlantStage] = useState(0); // 0: seed, 1: sprout, 2: growing, 3: mature

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Keep pixel art crisp

        // Load images (replace with your actual assets)
        const images = {
            plant: new Image(),
            water: new Image(),
            fertilizer: new Image(),
            harvest: new Image(),
        };
        images.plant.src = plantImg;
        images.water.src = waterImg;
        images.fertilizer.src = fertilizerImg;
        images.harvest.src = harvestImg;

        const draw = () => {
            ctx.clearRect(0, 0, 480, 270);
            // Draw plant based on stage
            if (plantStage === 0) ctx.drawImage(images.plant, 200, 150, 32, 32); // Seed
            else if (plantStage === 1) ctx.drawImage(images.plant, 200, 130, 48, 48); // Sprout
            else if (plantStage === 2) ctx.drawImage(images.plant, 200, 110, 64, 64); // Growing
            else if (plantStage === 3) ctx.drawImage(images.plant, 200, 90, 80, 80); // Mature

            // Draw action indicator
            if (prediction) {
                const actionImg = images[prediction.toLowerCase()];
                if (actionImg) ctx.drawImage(actionImg, 10, 10, 32, 32);
            }
        };

        draw();
    }, [plantStage, prediction]);

    useEffect(() => {
        if (prediction === 'Plant' && plantStage === 0) setPlantStage(1);
        else if (prediction === 'Water' && plantStage === 1) setPlantStage(2);
        else if (prediction === 'Fertilize' && plantStage === 2) setPlantStage(3);
        else if (prediction === 'Harvest' && plantStage === 3) setPlantStage(0);
    }, [prediction]);

    return (
        <canvas
            ref={canvasRef}
            width="480"
            height="270"
            className="absolute top-0 left-0 w-full h-full border-4 border-gray-800 rounded-lg"
            style={{ imageRendering: 'pixelated' }}
        />
    );
}

export default GameCanvas;