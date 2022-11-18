const screenWidth = window.innerWidth;      //(px)size
const screenHeight = window.innerHeight;

const cellScreenCrossTime = 10;     //(seg)

const cloudAmplitude = 100; // (px)
const cloudWidth = 500; // (px)

const cellMaxDiameter = 125;            //(px)
const cellMinDiameter = 50;            //(px)

const groupingFactor = 50; //  (%)

const cellMaxHeightPercent = 0 // (%)
const cellMinHeightPercent = 0    //(%)  


const createSystem = () => {

    const groupingPx = cellMinDiameter * groupingFactor / 100;
    const cellMaxHeight = cellMinDiameter * cellMaxHeightPercent / 100;           //(px)
    const cellMinHeight = cellMinDiameter * cellMinHeightPercent / 100;           //(px)

    const createCloud = (crossWidth, left, timeLife) =>   { 
        
        let leftPosition = -groupingPx;

        const contNube = document.createElement("div");         
        contNube.style =`
                        position: absolute;  
                        height: 100%;   
                        width: ${screenWidth}px;
                        left: ${left}px;
                        `;

        const nube = document.createElement("div");  //El 101% es porque sinó queda 1 linea vertical de 1px entre nube y nube (causas desconocidas)
        nube.style = `
                    position: absolute;  
                    height: 50%;   
                    width: 101%;   
                    bottom: 0;
                    background-color: white;
                    `;
        
        while (leftPosition < screenWidth ) {

            let random01 = Math.random();
            let randomRangeSize = (random01 * cellMaxDiameter) + ((1 - random01) * cellMinDiameter);  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin
            let cellFinalDiameter = randomRangeSize   //(px)

            random01 = Math.random();
            randomRangeHeight = (random01 * cellMaxHeight) + ((1 - random01) * cellMinHeight); 
            let cellFinalHeight = randomRangeHeight  //(px)
    
            let sinHeight = Math.abs(Math.sin( (leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth) * cloudAmplitude);
            
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
                    
            leftPosition += cellFinalDiameter - groupingPx;

            document.getElementById("contenedor").appendChild(contNube);

        }    

        contNube.appendChild(nube); 
        contNube.animate([
            // keyframes
            { transform: `translateX(0px)`},
            { transform: `translateX(${crossWidth}px)` }
        ], {
            // timing options
            duration: timeLife,
            timingFunction: "linear"
        });    
        
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


createSystem();





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