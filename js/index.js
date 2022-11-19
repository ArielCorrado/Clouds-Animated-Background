 
const createSystem = (top, color, crossTime, index, func, size) => {

    const cellMinTimeIncrease = 3000;  //(mSeg);
    const cellMaxTimeIncrease = 6000;  //(mSeg);

    const screenWidth = screen.width;      //(px)size   screen.width es el ancho en pixels del monitor del usuario
      
    const cellScreenCrossTime = crossTime;         //(seg)

    const cloudAmplitude = 100;         // (px)
    const cloudWidth = 500;         // (px)

    const cellMaxDiameter = 150;            //(px)
    const cellMinDiameter = 75;            //(px)

    const groupingFactor = 50;            //(%)
 
    const groupingPx = cellMinDiameter * groupingFactor / 100;
   
    const createCloud = (crossWidth, left, timeLife) =>   { 
        
        let leftPosition = -groupingPx;

        const contNube = document.createElement("div");         
        contNube.style =`
                        position: absolute;  
                        height: 100%;   
                        width: ${screenWidth}px;
                        left: ${left}px;
                        z-index: ${index};
                        `;

        const baseNube = document.createElement("div");  //El 101% es porque sinó queda 1 linea vertical de 1px entre nube y nube (causas desconocidas)
        baseNube.style = `
                    position: absolute;  
                    height: 50%;   
                    width: 101%;   
                    bottom: 0;
                        background-color: ${color};
                    `;
        
        while (leftPosition < screenWidth ) {

            let random01 = Math.random();
            let randomRange = (random01 * cellMaxDiameter) + ((1 - random01) * cellMinDiameter);  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin
            let cellFinalDiameter = randomRange   //(px)
                 
            let funcHeight = 0;

            (func === "sin") ? 
            funcHeight = Math.abs(Math.sin( (leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth) * cloudAmplitude) : 
            funcHeight = Math.abs(Math.cos( (leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth) * cloudAmplitude)

            const newCell = document.createElement("div");
            newCell.style =                 
                            `
                            width:${cellFinalDiameter}px; 
                            height:${cellFinalDiameter}px; 
                            border-top-right-radius: ${cellFinalDiameter/2}px;
                            border-top-left-radius: ${cellFinalDiameter/2}px;
                            left:${leftPosition}px; 
                            position:absolute; 
                            top:${-(cellFinalDiameter/2) - funcHeight}px;      
                            height: ${(cellFinalDiameter/2) + funcHeight}px;
                            background-color: ${color};
                            `;

            random01 = Math.random();
            randomRange = (random01 * cellMaxTimeIncrease) + ((1 - random01) * cellMinTimeIncrease); 
            let cellFinalTimeIncease = randomRange  //(mSeg)                

            newCell.animate([
                // keyframes
                { transform: `scale(105%)`},    //El 105% es porque sino aparece una raya abajo (causa desconocida)
                { transform: `scale(125%)`}
            ], {
                // timing options
                duration: cellFinalTimeIncease,
                timingFunction: "linear",
                iterations: Infinity,
                direction: "alternate"
            });                    

            baseNube.appendChild(newCell); 
                    
            leftPosition += cellFinalDiameter - groupingPx;
        }    

        contNube.appendChild(baseNube); 
        contNube.animate([
            // keyframes
            { transform: `translateX(0px)`},
            { transform: `translateX(${crossWidth}px)` }
        ], {
            // timing options
            duration: timeLife,
            timingFunction: "linear"
        });    

        contNube.style.top = `${top}px`;  ///////////////////////////////////////////////////
        document.getElementById("contenedor").appendChild(contNube);
        
        setTimeout(() => {
            contNube.remove();
        }, timeLife);
    }

    setInterval(() => {
        createCloud( -screenWidth * 2, screenWidth, cellScreenCrossTime * 1000 * 2);   
    }, cellScreenCrossTime * 1000);
    
    createCloud(-screenWidth, 0, cellScreenCrossTime * 1000);
    createCloud(-screenWidth * 2, screenWidth, cellScreenCrossTime * 1000 * 2);   
}




createSystem(0, "#2D72B7", 60, 1, "sin");

createSystem(50, "#5B94CD", 40, 2, "cos");

createSystem(100, "#94BCE3", 40, 3, "sin");

createSystem(150, "#D5E6F7", 30, 4, "cos");















// window.addEventListener("visibilitychange", () => {
//     if (document.hidden) {
//         document.getAnimations().forEach((animation) => animation.pause());             //Pausamos todas las animaciones
//         addPlay = false;
//     } else {
//         document.getAnimations().forEach((animation) => animation.play());              //Reanudamos todas las animaciones
//         addPlay = true;
//         createCell();
//     }
// })