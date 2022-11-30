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

let funcSin = false;

const cloudsSystemAmplitudes = [0];
const createSystem = (color, crossTime, size, cloudsXSystem, skyBottom, systemsDistance, index, systemCount) => {
 
    funcSin = !funcSin;
    
    const cellMinTimeIncrease = 2000;  //(mSeg);
    const cellMaxTimeIncrease = 5000;  //(mSeg);
    const cellScreenCrossTime = crossTime[index];         //(seg)

    const cloudWidth = (skyWidth/cloudsXSystem);           //(px)   //Ancho de cada nube
    const cloudAmplitude = (cloudWidth/5) * (size /100);                //(px)5
    const cellMaxDiameter = (cloudWidth/3) * (size /100);               //(px)3
    const cellMinDiameter = (cellMaxDiameter * 0.40) * (size /100);      //(px)0.5

    const groupingFactor = 35;            //(%)50
    const groupingPx = (cellMinDiameter * groupingFactor / 100);
              
    let topSystem = cloudAmplitude;         //Corrección altura de la primera nube (por defecto queda muy baja)
    if (index === (systemCount - 1)) {
        topSystem *= 0.93;
    }
  
    const contSystem = document.createElement("div");         
    contSystem.style =`
                        position: absolute;  
                        height: 100%;   
                        width: 100%;
                        z-index: ${index};
                        top: ${topSystem * systemsDistance }px;
                        `;

    const createCloud = (crossWidth, left, timeLife) =>   { 
 
        let leftPosition = -groupingPx;

        const contNube = document.createElement("div");         
        contNube.style =`
                        position: absolute;  
                        height: 100%;   
                        width: ${skyWidth}px;
                        left: ${left}px;
                        `;
        
        const baseNube = document.createElement("div");  //El 101% es porque sinó queda 1 linea vertical de 1px entre nube y nube (causas desconocidas)
        baseNube.style = `
                    position: absolute;  
                    height: ${skyBottom}%;   
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
            funcHeight = Math.abs(Math.sin((leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth ) * cloudAmplitude) : 
            funcHeight = Math.abs(Math.cos((leftPosition + (cellFinalDiameter/2)) * 3.14159 / cloudWidth ) * cloudAmplitude)

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
                { transform: `scale(115%)`},    //El 115% es porque sino aparece una raya abajo (causa desconocida)
                { transform: `scale(135%)`}
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
                      
        contSystem.appendChild(contNube);

        document.getElementById("contenedor").appendChild(contSystem);
        
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
    let minCrossTime = opts[1];
    let sizeSystem = opts[2];
    let minCloudsXS = opts[3];
    let skyBottom = opts[4];
    let systemsDistance = opts[5];

    let crossTimesSystems = [];
    let colorSystem = color;
    let numberOfCloudsXS = minCloudsXS;

    
    const calculateNewOptions = (i) => {

        /*   Colores   */
        let Rhex = color.slice(1,3);
        let Ghex = color.slice(3,5);
        let Bhex = color.slice(5,7);

        let Rrgb = parseInt(Rhex, 16);    
        let Grgb = parseInt(Ghex, 16);    
        let Brgb = parseInt(Bhex, 16);    

        Rrgb = Math.floor(Rrgb + ((255 - Rrgb) / (systemCount - 1)) * i);
        Grgb = Math.floor(Grgb + ((255 - Grgb) / (systemCount - 1)) * i);
        Brgb = Math.floor(Brgb + ((255 - Brgb) / (systemCount - 1)) * i);
     
        const addZero = (num) => {
            if (num.length === 1) {
                num = "0" + num;
                return num;
            }  
            return num; 
        }

        Rhex = Rrgb.toString(16);           // Si Rrgb vale 1 al pasarlo a hex nos da 1 y en realidad es 01 por eso la funcion addZero
        Rhex = addZero(Rhex);
        Ghex = Grgb.toString(16);
        Ghex = addZero(Ghex);
        Bhex = Brgb.toString(16);
        Bhex = addZero(Bhex);

        colorSystem = "#" + Rhex + Ghex + Bhex;
          
        /* Max Clouds per screen */
        const pasos = 2;                                                                    //Pasos de +2 nubes (eso indica el 2)
        numberOfCloudsXS = minCloudsXS + ( pasos * (systemCount - 1)) - (i * pasos);  

        // console.log(sizeSystem)
    }
    
        /* CrossTimes Array*/
    const timeSteepFactor = 2;
    for (let i=0; i<systemCount; i++) {
        crossTimesSystems.push(minCrossTime * (timeSteepFactor**(systemCount - 1 - i)))  //timeSteepFactor = 2 indica que el timempo se va multiplicado por 2 al pasar de sistema en sistema
    }    

    for (let i=0 ; i<systemCount ; i++) {
        
        calculateNewOptions(i);
        createSystem(colorSystem, crossTimesSystems, sizeSystem, numberOfCloudsXS, skyBottom, systemsDistance, i, systemCount);
        
    }
}

const options = [   "#2965A2", // (color (Hex)
                    30, // Min CrossTime(Seg)
                    90, // size(%)
                    4, // Min clouds Per Screen Width(int)
                    50, // skyBottom (%)50
                    5.5, // system distance (int);
                ]; 
                                                     
createSky(options, 5);

window.onresize = () => {
    if(skyWidth != getSkyWidth()) {
        intervalIds.forEach((id) => clearInterval(id));
        intervalIds.length = 0;
        document.getElementById("contenedor").innerHTML = "";
        setSkyWidth();
        createSky(options, 5);
    }    
}

