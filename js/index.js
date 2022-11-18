const screenWidth = window.innerWidth;      //(px)
const screenHeight = window.innerHeight;

const cellScreenCrossTime = 10;     //(seg)

const amplitude = 100; // (px)

const cloudWidth = 500; // (px)

const cellMaxSize = 150;            //(px)
const cellMinSize = 50;            //(px)

const groupingFactor = 50; //  (%)
const groupingPx = cellMinSize * groupingFactor / 100;

const cellMaxHeightPercent = 30 // (%)
const cellMaxHeight = cellMinSize * cellMaxHeightPercent / 100;           //(px)

const cellMinHeightPercent = 0    //(%)  
const cellMinHeight = cellMinSize * cellMinHeightPercent / 100;           //(px)


const cellVelocity = screenWidth / cellScreenCrossTime; //( px/s )




const createCloud = (left, timeLife) =>   { 

    let leftPosition = -groupingFactor;

    const contNube = document.createElement("div");         
    contNube.style =`
                    position: absolute;  
                    height: 100%;   
                    width: ${screenWidth}px;
                    left: ${left}px
                    `
    document.body.appendChild(contNube);
    
    const nube = document.createElement("div");
    nube.style = `
                position: absolute;  
                height: 50%;   
                width: 100%;
                bottom: 0;
                background-color: white;
                animation-name: cloudAnimation;
                animation-duration: ${cellScreenCrossTime}s;
                animation-timing-function: linear;
                `;
    contNube.appendChild(nube);

    while (leftPosition < screenWidth ) {

        let random01 = Math.random();
        let randomRangeSize = (random01 * cellMaxSize) + ((1 - random01) * cellMinSize);  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin
        let cellFinalDiameter = randomRangeSize   //(px)

        random01 = Math.random();
        randomRangeHeight = (random01 * cellMaxHeight) + ((1 - random01) * cellMinHeight); 
        let cellFinalHeight = randomRangeHeight  //(px)
   
        let sinHeight = Math.abs(Math.sin( (leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth) * amplitude);
        
        const newCell = document.createElement("div");
        newCell.style =                 
                        `
                        width:${cellFinalDiameter}px; 
                        height:${cellFinalDiameter}px; 
                        border-top-right-radius: ${cellFinalDiameter/2}px;
                        border-top-left-radius: ${cellFinalDiameter/2}px;
                        left:${leftPosition}px; 
                        position:absolute; 
                        top:${-(cellFinalDiameter/2) - sinHeight - cellFinalHeight}px;      
                        height: ${(cellFinalDiameter/2) + sinHeight + cellFinalHeight}px;
                        background-color:white;
                        `;

        nube.appendChild(newCell); 
        
        leftPosition += cellFinalDiameter - groupingFactor;
    }    
    
    setTimeout(() => {
        contNube.remove();
    }, timeLife);
}

const intervalId = setInterval(() => {
    createCloud(screenWidth - 1, cellScreenCrossTime * 1000 * 2);   //El -1 es porque sinó queda 1 linea vertical de 1px entre nube y nube (causas desconocidas)
}, cellScreenCrossTime * 1000);

    
createCloud(0, cellScreenCrossTime * 1000);
createCloud(screenWidth - 1, cellScreenCrossTime * 1000 * 2);   //El -1 es porque sinó queda 1 linea vertical de 1px entre nube y nube (causas desconocidas



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