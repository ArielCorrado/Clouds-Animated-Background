let screenWidth = screen.width;           //(px)size   screen.width es el ancho en pixels del monitor del usuario
let intervalIds = [];
const createSystem = (top, color, crossTime, index, func, size) => {

    const cellMinTimeIncrease = 3000;  //(mSeg);
    const cellMaxTimeIncrease = 6000;  //(mSeg);
    const cellScreenCrossTime = crossTime;         //(seg)

    let cloudWidth = screenWidth/6;         //(px)   //Ancho de cada nube
    let cloudAmplitude = cloudWidth/3;      //(px)100
    let cellMaxDiameter = screenWidth/10;            //(px)150
    let cellMinDiameter = cellMaxDiameter*0.5;            //(px)75

    cloudAmplitude *= size/100;
    cloudWidth *= size/100;
    cellMaxDiameter *= size/100;
    cellMinDiameter *= size/100;

    const groupingFactor = 50;            //(%)50
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
            funcHeight = Math.abs(Math.sin((leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth / 2) * cloudAmplitude) : 
            funcHeight = Math.abs(Math.cos((leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth / 2) * cloudAmplitude)

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

        contNube.style.top = `${top}px`;        // Distancia del contenedor de la nube al lado superior de la pantalla (top) llega como parametro de la función createSystem
        document.getElementById("contenedor").appendChild(contNube);
        
        setTimeout(() => {
            contNube.remove();
        }, timeLife);
    }

    const intervalId = setInterval(() => {
        createCloud( -screenWidth * 2, screenWidth, cellScreenCrossTime * 1000 * 2);    //Tercera Nube (cruza la distancia de 2 pantallas)
    }, cellScreenCrossTime * 1000);
    intervalIds.push(intervalId);
    
    createCloud(-screenWidth, 0, cellScreenCrossTime * 1000);                           //Esta es la nube que se ve primero y cubre toda la pantalla (solo cruza el ancho de una pantalla)
    createCloud(-screenWidth * 2, screenWidth, cellScreenCrossTime * 1000 * 2);         //Esta es la nube que viene despues (2º nube) (cruza la distancia de 2 pantallas)
    
}

const createSky = () => {

    createSystem(0, "#2D72B7", 50, 1, "sin", 50);

    createSystem(50, "#5B94CD", 40, 2, "cos", 50);

    createSystem(100, "#94BCE3", 30, 3, "sin", 50);

    createSystem(175, "#D5E6F7", 20, 4, "cos", 50);
}

createSky();

window.onresize = () => {
    intervalIds.forEach((id) => clearInterval(id));
    intervalIds.length = 0;
    document.getElementById("contenedor").innerHTML = "";
    screenWidth = screen.width;
    createSky();
}













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