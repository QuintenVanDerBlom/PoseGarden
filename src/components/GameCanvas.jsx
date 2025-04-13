import { useEffect, useRef, useState } from 'react';

// Images voor de game
import sproutImg from '../assets/sprout.png';
import growingImg from '../assets/growing.png';
import teenImg from '../assets/teen.png';
import matureImg from '../assets/mature.png';
import adultImg from '../assets/adult.png';

function GameCanvas({ prediction }) {
    const canvasRef = useRef(null);
    const [plantStage, setPlantStage] = useState(0); // 0 t/m 4

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const images = {
            sprout: new Image(),
            growing: new Image(),
            teen: new Image(),
            mature: new Image(),
            adult: new Image(),
        };
        images.sprout.src = sproutImg;
        images.growing.src = growingImg;
        images.teen.src = teenImg;
        images.mature.src = matureImg;
        images.adult.src = adultImg;

        const loadImages = Promise.all(
            Object.values(images).map(img =>
                new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = () => console.error(`Kan dit plaatje niet laden: ${img.src}, check je assets!`);
                })
            )
        );

        loadImages.then(() => {
            const draw = () => {
                ctx.clearRect(0, 0, 480, 270);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(0, 0, 480, 270);


                const plantX = 480 / 2 - 60;
                const plantY = 270 - 140;
                if (plantStage === 0) ctx.drawImage(images.sprout, plantX, plantY + 30, 64, 64);
                else if (plantStage === 1) ctx.drawImage(images.growing, plantX, plantY, 96, 96);
                else if (plantStage === 2) ctx.drawImage(images.teen, plantX - 16, plantY - 40, 128, 128);
                else if (plantStage === 3) ctx.drawImage(images.mature, plantX - 32, plantY - 60, 160, 160);
                else if (plantStage === 4) ctx.drawImage(images.adult, plantX - 48, plantY - 80, 192, 192);
            };

            draw();
        }).catch(err => console.error('Probleem met laden van plaatjes:', err));
    }, [plantStage]);


    useEffect(() => {
        if (prediction === 'Plant' && plantStage === 0) setPlantStage(1);
        else if (prediction === 'Water' && plantStage === 1) setPlantStage(2);
        else if (prediction === 'Fertilize' && plantStage === 2) setPlantStage(3);
        else if (prediction === 'Water' && plantStage === 3) setPlantStage(4);
        else if (prediction === 'Harvest' && plantStage === 4) setPlantStage(0);
    }, [prediction]);

    return (
        <canvas
            ref={canvasRef}
            width="480"
            height="270"
            className="w-full h-full rounded-lg"
            style={{ imageRendering: 'pixelated' }}
        />
    );
}

export default GameCanvas;