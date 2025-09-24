///////////////////////////
// var intro = document.getElementById('intro');
// intro.style.background = "url('assets/img/bici-03-0000-removebg-preview.png') no-repeat";
/////////////////////////



///////////////////////

function validar() {
    var Seleccion_personajes = document.getElementById('Personajes');

    if (Seleccion_personajes.value == 0 || Seleccion_personajes.value == "") {
        
        Seleccion_personajes.focus();
    }
    if (Seleccion_personajes.value == 1) {
        location.href = "Personaje_1.html";

        Seleccion_personajes.focus();

    }
    if (Seleccion_personajes.value == 2) {
        location.href = "Personaje_2.html";
        Seleccion_personajes.focus();
    }
    if (Seleccion_personajes.value == 3) {
        location.href = "Personaje_3.html";
        Seleccion_personajes.focus();
    }
}



/* function Cambiar1() {
    var Seleccion = document.getElementById('BotonCambiar');
    var imagen = document.getElementById('intro');

    Seleccion =
        imagen.style.background = 'url("assets/img/Recursogirl.png")';


    imagen.style.width = '84px';
    imagen.style.height = '84px';
    imagen.style.backgroundSize = ' 336px 84px';




};

function Cambiar2() {
    var Seleccion = document.getElementById('BotonCambiar');
    var imagen = document.getElementById('intro');

    Seleccion =
        imagen.style.background = 'url("assets/img/Recursomen.png")';
    imagen.style.backgroundSize = ' 374px 80px';





};

function Cambiar3() {
    var Seleccion = document.getElementById('BotonCambiar');
    var imagen = document.getElementById('intro');

    Seleccion =
        imagen.style.background = 'url("assets/img/dino22.png")';

    imagen.style.backgroundSize = ' 339px 83px';
    imagen.style.width = '84px';
    imagen.style.height = '84px';
}; */

