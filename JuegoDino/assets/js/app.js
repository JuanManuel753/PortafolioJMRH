//****** GAME LOOP ********//
var time = new Date();
var deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
    
} else {
    document.addEventListener("DOMContentLoaded", Init);
    
}
//Funcion iniciar todo
function Init() {
    time = new Date(); 
    Start();
    Loop();
    
}
//Funcion repetir
function Loop() {
    
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
    
    
}

//****** LOGICA DEL JUEGO ********//

var sueloY = 22;
var velY = 0;
var velYB = 0;


var impulso = 900;
var impulsobajo = -850;
var gravedad = 2500;


var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

//obstaculo
var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;

var obstaculos = [];



//nubes
var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7 ;
var tiempoNubeMax = 1.9;
var maxNubeY = 350;
var minNubeY = 150;
var nubes = [];
var velNube = 0.5;



//dino y contenedor
var contenedornoche;
var contenedor;
var dino;
var textoScore;

var suelo;
var gameOver;

//Best Score
var BestScore = -1;
var TextBestScore;


//sonidos
var sonido;


//funcion que inicia y muestra todos los contenedores
function Start() {
    
    gameOver = document.querySelector(".game-over");//contenedor de game over
    suelo = document.querySelector(".suelo"); //contenedor de suelo
    contenedor = document.querySelector(".contenedor"); //contenedor de Obstaculos
    
    contenedornoche = document.querySelector(".contenedornoche")
    textoScore = document.querySelector(".score"); //contenedor del Score
    dino = document.querySelector(".dino1") || document.querySelector(".dino2")   ||document.querySelector(".dino3");//contenedor de personajes
    TextBestScore = document.querySelector(".BestScore");//contedor BestScore
    contenedorlluvia = document.getElementById('contenedorlluvia');//contenedor de lluvia
    sonido = document.getElementById('sonidos');//sonidos
    //contenedorSol = document.getElementById('contenedorSol'); // Contenedor de Sol
    contenedorLuna = document.getElementById('contenedorLuna'); //// Contenedor de Luna
    document.addEventListener("keydown", SaltarBajar);//contenedor de eventos, saltar y bajar

    //Codigo que guarda bestScore en la base de datos del navegador
    if (localStorage.getItem('BestScore')){
        BestScore = localStorage.getItem('BestScore');
        
    }
    
    
}

//funcion de actualizar o cuando salimos del navegador el juego tome una pausa
function Update() {
    if (parado) return;
    
    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();
    velY -= gravedad * deltaTime;
    

}

// ASCII: FLECHA IZQUIERDA = 37 --- FLECHA ARRIBA = 38 --- FLECHA DERECHA = 39 --- FLECHA ABAJO = 40 ---
// ASCII: TECLA W =87  --- TECLA S = 83
// Saltar Y Bajar
function SaltarBajar(ev) {
    if (ev.keyCode == 38 || ev.keyCode == 32 || ev.keyCode == 87) {
        Saltar();
        if (dinoPosY === sueloY) {
        sonido.innerHTML = '<audio src="assets/sonidos/jump.mp3" autoplay></audio>';}
    }else if(ev.keyCode == 40 || ev.keyCode == 83){
        Bajar();
        if (dinoPosY != sueloY) {
            sonido.innerHTML = '<audio src="assets/sonidos/caida1.mp3" autoplay></audio>';
        } 
    }
}

//Funcion Caer mas rapido del aire --- la funcion se aplica con la tecla S. la flecha bajo.
function Bajar() {
    if (dinoPosY != sueloY) {
        saltando = true;
        velY = impulsobajo;
        dino.classList.remove("dino-corriendo1");
        dino.classList.remove("dino-corriendo2");
        dino.classList.remove("dino-corriendo3");
    }
}

//funcion Saltar --- la funcion se aplica con la tecla W. la flecha arriba y el espacio.
function Saltar() {
    if (dinoPosY === sueloY) {
        saltando = true;
        
        velY = impulso;
        dino.classList.remove("dino-corriendo1");
        dino.classList.remove("dino-corriendo2");
        dino.classList.remove("dino-corriendo3");
        
    }
}




// funcion que hace mover al personaje
function MoverDinosaurio() {
    
    dinoPosY += velY * deltaTime;
    if (dinoPosY < sueloY) {
        TocarSuelo();
        
    }
    dino.style.bottom = dinoPosY + "px";
    
}

//funcion que hace estar en el suelo mientras hace movimiento  correr el personaje
function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if (saltando) {
        dino.classList.add("dino-corriendo1");
        dino.classList.add("dino-corriendo2");
        dino.classList.add("dino-corriendo3");
    }
    saltando = false;
}


//funcion que hace el efecto de mover el suelo.
function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
    
}


function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}


//funcion que detecta cuando el personaje se estrella con un obstaculo
function Estrellarse() {
    dino.classList.remove("dino-corriendo1");
    dino.classList.remove("dino-corriendo2");
    dino.classList.remove("dino-corriendo3");
    dino.classList.add("dino-estrellado1");
    dino.classList.add("dino-estrellado2");
    dino.classList.add("dino-estrellado3");
    parado = true;
    sonido.innerHTML = '<audio src="assets/sonidos/GameOverSound.mp3" autoplay></audio>';  
}


//decision de crear oBSTACULO
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

//decision de crear nubes
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

//creacion de objetos Obstaculo
function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if (Math.random() > 0.2) obstaculo.classList.add("cactus2");
    if (score>=25) {
        if (Math.random() > 0.2) obstaculo.classList.add("cactus");
        if (Math.random() > 0.2) obstaculo.classList.add("cactus2");
        if (Math.random() > 0.4) obstaculo.classList.add("Pajaroalto");  
    }
    if (score>=50) {
        if (Math.random() > 0.2) obstaculo.classList.add("cactus");
        if (Math.random() > 0.2) obstaculo.classList.add("cactus2");
        if (Math.random() > 0.4) obstaculo.classList.add("Pajaroalto");
        if (Math.random() > 0.8) obstaculo.classList.add("Pajarobajo");  
    }
    if (score>=100) {
        if (Math.random() > 0.2) obstaculo.classList.add("cactus");
        if (Math.random() > 0.2) obstaculo.classList.add("cactus2");
        if (Math.random() > 0.4) obstaculo.classList.add("Pajaroalto");  
        if (Math.random() > 0.8) obstaculo.classList.add("Pajarobajo");
        if (Math.random() > 0.6) obstaculo.classList.add("PajaroMedio");
    }
    if (score>=150) {
        if (Math.random() > 0.2) obstaculo.classList.add("cactus");
        if (Math.random() > 0.2) obstaculo.classList.add("cactus2");
        if (Math.random() > 0.4) obstaculo.classList.add("Pajaroalto");
        if (Math.random() > 0.6) obstaculo.classList.add("PajaroMedio");
        if (Math.random() > 0.8) obstaculo.classList.add("Pajarobajo");
        if (Math.random() > 0.8) obstaculo.classList.add("Perrito");
    }
    
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";
    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

//creacion de objetos Nube
function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}
//creacion de objeto Sol y Luna



//movimiento de nubes
function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

//movimiento de Obstaculos cactus
function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}



//funcion de ganar puntos por obstaculo superado
function GanarPuntos() {
    score++;  //incrementador del puntaje por obstaculo superado


    //--Este codigo aumenta el contador de BestScore,Sin Embargo Impide Que se Guarden los archivos--  
    //if(score>BestScore){
    //BestScore++;}
    //--Este codigo aumenta el contador de BestScore,Sin Embargo Impide Que se Guarden los archivos--

    // condicion que actualiza el nuevo bestScore logrado por el jugador
    if (score>BestScore){
        BestScore=score;
        TextBestScore ="BestScore" + BestScore;
        window.localStorage.setItem('BestScore', BestScore);
    }
    TextBestScore.innerText = BestScore; //muestra en pantalla la mejor puntuacion
    textoScore.innerText = score; //muestra en pantalla la puntuacion actual

    //Dependiendo del Score Cambiamos el Background haciendolo parecer que esta recorriendo el dia entero
     if(score == 25){

        //contenedor.style.backgroundImage = 'url("/img/Recursos-para-el-video-juego/Fondo-Actualizado-noche.png")'; codigo para cambiar background mediante las estaciones del dia *NO FUNCIONA*
        contenedor.classList.add("mañana");
        gameVel = 1; 
    }else if(score == 50){
        gameVel = 1.1;
        contenedor.classList.add("mediodia");
    }else if (score == 75) {
        gameVel = 1.2;
        //contenedorSol.style.display = 'none'; //quita imagen del sol
        contenedorLuna.style.display = 'block'; // coloca imagen de la luna
        contenedor.classList.add("tarde");
    }else if (score == 100) {
        gameVel = 1.4;
        contenedor.classList.add("noche");
        contenedorlluvia.style.display = 'block'; // se llama el contenedor creado en la funcion start y se modifica el css que estaba con display:none; para que quede display block y aparezca el efecto lluvia
    }else if(score == 125){
        gameVel = 1.5;
        contenedor.classList.add("mañana1");
        //contenedorSol.style.display = 'block'; // coloca imagen de el sol
        contenedorLuna.style.display = 'none'; //quita imagen de la luna
        contenedorlluvia.style.display = 'none'; //se llama el contenedor creado en la funcion start y se modifica el javascript de la noche que estaba con display:block; para que quede display none y desaparezca el efecto lluvia
    }else if(score == 150){
        gameVel = 1.7;
        contenedor.classList.add("mediodia1");
    }else if(score == 175) {
        gameVel = 1.9;
        //contenedorSol.style.display = 'none'; //quita imagen del sol
        contenedorLuna.style.display = 'block'; // coloca imagen de la luna
        contenedor.classList.add("tarde1");
    }else if(score == 200) {
        gameVel = 2.1;
        contenedor.classList.add("noche1");
        contenedorlluvia.style.display = 'block';// se llama el contenedor creado en la funcion start y se modifica el css que estaba con display:none; para que quede display block y aparezca el efecto lluvia
    }
    else if (score == 225)
    {
        gameVel = 2.3;
        contenedor.classList.add("mañanafinal");
        //contenedorSol.style.display = 'none'; //quita imagen del sol
        contenedorLuna.style.display = 'none'; // coloca imagen de la luna
        contenedorlluvia.style.display = 'none'; //se llama el contenedor creado en la funcion start y se modifica el javascript de la noche que estaba con display:block; para que quede display none y desaparezca el efecto lluvia
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

//Funcion Game Over, se activa cuando se detecta la funcion estrellarse
function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";

}

//detectar colision  se activa cuando choca con un obstaculo el cual activa la funcion game over
function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        } else {
            if (IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

//funcion que relogea todo el juego cuando actualiza la pagina, borrando el Score conseguido por el momento mas sin embargo no se borra el BestScore
function actualizar() {
    location.reload(true);
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}
