const screenWidth = window.innerWidth;      //(px)
const screenHeight = window.innerHeight;

const cellScreenCrossTime = 20;     //(seg)

const amplitude = 100; // (px)

const cloudWidth = 500; // (px)

const cellMaxSize = 150;            //(px)
const cellMinSize = 70;            //(px)

const groupingFactor = 50; //  (%)
const groupingPx = cellMinSize * groupingFactor / 100;

const cellMaxHeight = 30;           //(px)
const cellMinHeight = 0;            //(px)  

const cellVelocity = screenWidth / cellScreenCrossTime; //( px/s )

let leftPosition = -groupingFactor;



const createClouds = () =>   { 

    while (leftPosition < screenWidth) {

        let random01 = Math.random();
        let randomRangeSize = (random01 * cellMaxSize) + ((1 - random01) * cellMinSize);  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin
        let cellFinalDiameter = randomRangeSize   //(px)

        random01 = Math.random();
        randomRangeHeight = (random01 * cellMaxHeight) + ((1 - random01) * cellMinHeight); 
        let cellFinalHeight = randomRangeHeight  //(px)
   
        let sinHeight = Math.abs(Math.sin( (leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth) * amplitude);
        
        const newCell = document.createElement("div");
        newCell.className = "cell";
        newCell.style =                 
                        `
                        width:${cellFinalDiameter}px; 
                        height:${500}px; 
                        border-radius:${cellFinalDiameter/2}px; 
                        left:${leftPosition}px; 
                        position:absolute; 
                        top:${(-cellFinalDiameter/2) - sinHeight - cellFinalHeight}px;      
                        background-color:white;
                        `;
        
        document.getElementById("baseNube").appendChild(newCell);      

        leftPosition += cellFinalDiameter - groupingFactor;
    }    

}

createClouds();




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