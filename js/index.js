const screenWidth = window.innerWidth;      //(px)
const screenHeight = window.innerHeight;

const cellInitialDiameter = 50;  //(px)
const cellScreenCrossTime = 20;     //(seg)

const groupingFactor = 0.65; // reduce el tiempo que tarda en salir la siguiente celda asi estas se agrupan (se superponen) toma valores de 0 a 1;

const cellMaxSize = 400;            //(%)
const cellMinSize = 100;            //(%)

const cellMaxHeight = 25;           //(%)
const cellMinHeight = 0;            //(%)  

const cellVelocity = screenWidth / cellScreenCrossTime; //( px/s )

let addPlay = true;

const createCell = () =>   {
   
    let random01 = Math.random();
    let randomRangeSize = (random01 * cellMaxSize) + ((1 - random01) * cellMinSize)  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin

    random01 = Math.random();
    randomRangeHeight = (random01 * cellMaxHeight) + ((1 - random01) * cellMinHeight)  

    let cellFinalDiameter = cellInitialDiameter * randomRangeSize / 100;        //(px)
    let cellFinalHeight = cellFinalDiameter * randomRangeHeight / 100;  //(px)
    
    let newCellCreationDelay = (cellFinalDiameter / cellVelocity) * groupingFactor; // (seg)
    
    const newCell = document.createElement("div");
    newCell.className = "cell";
    newCell.style =                 //La linea 38 pone las celdas centradas en la mitad de la pantalla y despues las eleva un poco con cellFinalHeight
                    `
                    width:${cellFinalDiameter}px; 
                    height:${cellFinalDiameter}px; 
                    border-radius:50%; 
                    right:${-cellFinalDiameter}px; 
                    position:absolute; 
                    top:${(window.innerHeight/2)-(cellFinalDiameter/2) - cellFinalHeight}px;      
                    background-color:white;
                    animation-name: crossScreen;
                    animation-duration: ${cellScreenCrossTime}s;
                    animation-timing-function: linear
                    `;

    newCell.setAttribute("height", cellFinalHeight);                

    document.getElementById("contNube").appendChild(newCell);      

    if (addPlay) {
        setTimeout(createCell, newCellCreationDelay * 1000)
    };
    
    window.onresize = () => {
        const cells = document.getElementsByClassName("cell");
        for (const cell of cells) {
            cell.style.top = ((window.innerHeight/2)-(cell.offsetHeight/2) - cell.getAttribute("height")) + "px";
        }
    }
}

createCell ();

window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.getAnimations().forEach((animation) => animation.pause());             //Pausamos todas las animaciones
        addPlay = false;
    } else {
        document.getAnimations().forEach((animation) => animation.play());              //Reanudamos todas las animaciones
        addPlay = true;
        createCell();
    }
})