let skyWidth = screen.width;           //(px)size   screen.width es el ancho en pixels del monitor del usuario
let intervalIds = [];


const setSkyWidth = () => {                 //Esta funcion verifica si el alto o el ancho de la pantalla es mas alto y al mas alto lo configura como el ancho del contenedor de nubes
    if (screen.width > screen.height) { 
        skyWidth = screen.width;
    } else { 
        skyWidth = screen.height;
    }    
}
setSkyWidth();

const getSkyWidth = () => {                 //Esta funcion verifica si el alto o el ancho de la pantalla es mas alto y al mas alto lo configura como el ancho del contenedor de nubes
    if (screen.width > screen.height) { 
        return screen.width;
    } else { 
        return screen.height;
    }    
}

let index = 0;
let funcSin = false;
const createSystem = (color, crossTime, size, div, systemHeight) => {
    
    funcSin = !funcSin;
    index++;

    const cellMinTimeIncrease = 2000;  //(mSeg);
    const cellMaxTimeIncrease = 5000;  //(mSeg);
    const cellScreenCrossTime = crossTime;         //(seg)

    let cloudWidth = skyWidth/div;         //(px)   //Ancho de cada nube
    let cloudAmplitude = cloudWidth/2.5;      //(px)100
    let cellMaxDiameter = skyWidth/10;            //(px)150
    let cellMinDiameter = cellMaxDiameter*0.4;            //(px)75

    cloudAmplitude *= size/100;
    cloudWidth *= size/100;
    cellMaxDiameter *= size/100;
    cellMinDiameter *= size/100;
    const top = (cloudWidth * 1.5) - (window.innerHeight * systemHeight / 100);

    const groupingFactor = 50;            //(%)50
    const groupingPx = cellMinDiameter * groupingFactor / 100;
   
    const createCloud = (crossWidth, left, timeLife) =>   { 
        
        let leftPosition = -groupingPx;

        const contNube = document.createElement("div");         
        contNube.style =`
                        position: absolute;  
                        height: 100%;   
                        width: ${skyWidth}px;
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
        
        while (leftPosition < skyWidth ) {

            let random01 = Math.random();
            let randomRange = (random01 * cellMaxDiameter) + ((1 - random01) * cellMinDiameter);  // Esta linea genera un numero en el rango entre celdaMax y CeldaMin
            let cellFinalDiameter = randomRange   //(px)
                 
            let funcHeight = 0;

            (funcSin === true) ? 
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
        createCloud( -skyWidth * 2, skyWidth, cellScreenCrossTime * 1000 * 2);    //Tercera Nube (cruza la distancia de 2 pantallas)
    }, cellScreenCrossTime * 1000);
    intervalIds.push(intervalId);
    
    createCloud(-skyWidth, 0, cellScreenCrossTime * 1000);                           //Esta es la nube que se ve primero y cubre toda la pantalla (solo cruza el ancho de una pantalla)
    createCloud(-skyWidth * 2, skyWidth, cellScreenCrossTime * 1000 * 2);         //Esta es la nube que viene despues (2º nube) (cruza la distancia de 2 pantallas)
    
}

const createSky = (opts, systemCount) => {

    let color = opts[0];
    let crossTime = opts[1];
    let size = opts[2];
    let maxCloudsXS = opts[3];
    let height = opts[4];

    let colorSystem = color;
    let crossTimeSystem = crossTime;
    let sizeSystem = size;
    let numberOfCloudsXS = maxCloudsXS;

    const calculateNewOptions = (i) => {

        /*   Colores   */
        let Rhex = color.slice(1,3);
        let Ghex = color.slice(3,5);
        let Bhex = color.slice(5,7);

        let Rrgb = parseInt(Rhex, 16);    
        let Grgb = parseInt(Ghex, 16);    
        let Brgb = parseInt(Bhex, 16);    

        Rrgb = Rrgb + (Math.round( (255 - Rrgb) / (systemCount - 1)) * i);
        Grgb = Grgb + (Math.round( (255 - Grgb) / (systemCount - 1)) * i);
        Brgb = Brgb + (Math.round( (255 - Brgb) / (systemCount - 1)) * i);

        Rhex = Rrgb.toString(16);
        Ghex = Grgb.toString(16);
        Bhex = Brgb.toString(16);

        colorSystem = "#" + Rhex + Ghex + Bhex;

        /* CrossTime */
        if (i != 0) {
            crossTimeSystem = crossTimeSystem - crossTimeSystem * 0.33;
        }    
        
        /*  Size  */
        if (i != 0) {
            sizeSystem = sizeSystem + sizeSystem * 0.33;
        }    

        // /* Max Clouds per screen */
        // numberOfCloudsXS = maxCloudsXS - i;    


        console.log(numberOfCloudsXS)
    }

    for (let i=0 ; i<systemCount ; i++) {
        
        calculateNewOptions(i);
        createSystem(colorSystem, crossTimeSystem, sizeSystem, numberOfCloudsXS, height)
        
    }


   
    // createSystem("#2D72B7", 120, 30, 8, 20);  
    // createSystem("#5B94CD", 80, 40, 7, 20);
    // createSystem("#94BCE3", 60, 50, 6, 20);
    // createSystem("#D5E6F7", 40, 60, 5, 20);
}

const options = ["#2D72B7", 130, 30, 8, 20];  // (color (Hex), CrossTime(Seg), size(%), cloudsPerScreenWidth(int) in top system, systeHeight(% of  window Height));

createSky(options, 4);

window.onresize = () => {
    if(skyWidth != getSkyWidth()) {
        intervalIds.forEach((id) => clearInterval(id));
        intervalIds.length = 0;
        document.getElementById("contenedor").innerHTML = "";
        setSkyWidth();
        createSky();
    }    
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