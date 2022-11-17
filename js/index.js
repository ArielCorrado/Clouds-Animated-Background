

let paused = false;
const createCell = () =>   {

    window.addEventListener ("visibilitychange", () => {
        const celdas = document.getElementsByClassName("cell");
        if (paused) {
            for (const celda of celdas) {
                celda.style.animationPlayState = "paused";
            } 
        }  else {
                for (const celda of celdas) {
                    celda.style.animationPlayState = "running";
                }
            }       
        paused = !paused;     
    });

    
            
    const cellInitialDiameter = 50;  //(px)
    const cellScreenCrossTime = 20;     //(seg)
    const screenWidth = window.innerWidth;      //(px)
    const groupingFactor = 0.65; // reduce el tiempo que tarda en salir la siguiente celda asi estas se agrupan (se superponen);

    const cellMaxSize = 400;            //(%)
    const cellMinSize = 100;            //(%)

    const cellMaxHeight = 25;           //(%)
    const cellMinHeight = 0;            //(%)   

    let random01 = Math.random();
    let randomRangeSize = (random01 * cellMaxSize) + ((1 - random01) * cellMinSize)  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin

    random01 = Math.random();
    randomRangeHeight = (random01 * cellMaxHeight) + ((1 - random01) * cellMinHeight)  

    let cellFinalDiameter = cellInitialDiameter * randomRangeSize / 100;        //(px)
    let cellFinalHeight = cellFinalDiameter * randomRangeHeight / 100;  //(px)

    const cellVelocity = screenWidth / cellScreenCrossTime; //( px/s )
    let newCellCreationDelay = cellFinalDiameter / cellVelocity; // (seg)
    newCellCreationDelay = newCellCreationDelay * groupingFactor;      

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

    document.getElementById("contNube").appendChild(newCell);      

    setTimeout(createCell, newCellCreationDelay * 1000);
    console.log(cellFinalHeight)
}

createCell ();
