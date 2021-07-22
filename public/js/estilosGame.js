//Estilos
var btnFile = document.getElementById("btnFile"),
    direccion = "", //Cambiar por el dominio
    docIn = document.getElementById("docIn"),
    textoIn = document.getElementById("textoIn"),
    wordsInfo = document.getElementById("wordsInfo"),
    pageInfo = document.getElementById("pageInfo"),
    velInfo = document.getElementById("velInfo"),
    words = 0,
    pages = 0,
    velocidad = 200,//Control de velocidad
    opcionBtn = document.getElementById('opcionBtn'),
    retryBtn = document.getElementById('retryBtn'),
    velPP = document.getElementById('velPP'),
    velMM = document.getElementById('velMM'),
    msg = document.getElementById("msg"),
    btnStart = document.getElementById('btnStart'),
    btnSubir = document.getElementById('btnSubir'),
    gameArea = document.getElementById('gameArea'),
    inForm = document.getElementById('inForm'),
    rbtn = document.getElementById('rbtn'),
    textShow = document.getElementById('textShow'),
    sunNmoon = document.getElementById('sunNmoon'),//Variable para controlar el modo oscuro
    gameContent = document.getElementById('gameContent'), //Variable del contenedor del juego
    configOptions = document.getElementById('configOptions'), //Variable para el contenedor de la opciones de configuracion
    encabezado = document.getElementById('encabezado'), //Contenedor del encabezado;
    bgChange = document.getElementById('bgChange'), //Boton para el cambio del fondo
    opcionesBtn = document.getElementById('opcionesBtn'), //Boron del menu de opciones
    imgHead = document.getElementById('imgHead'),
    ppv = document.getElementById('ppv'),//Input de las veces que se mostraran las palabras
    resetBtn = document.getElementById('resetBtn'),
    backBtn = document.getElementById('backBtn'),
    pdfToolsCnt = document.getElementById('pdfToolsCnt'), //Contenedor del menu de pdf
    swbtn = document.getElementById('swbtn'),
    desdeIn = document.getElementById('desdeIn'),//Controles del numero de pagina
    hastaIn = document.getElementById('hastaIn'),
    avisoPdf = document.getElementById('avisoPdf'),
    btnReady = document.getElementById('btnReady'),//Boton del area de menu pdf
    infoItem = document.getElementsByClassName('infoItem'),//Llos items que muestran informacion
    slideCnt = document.getElementById('slideCnt'),//Contenedor del menu de pdf
    loadCnt = document.getElementById('loadCnt'),//Contenedor del area de cargado
    completeText = document.getElementById('completeText'), //Contenedor del texto completo
    copyOpBtn = document.getElementById('copyOpBtn'), //Botones de copiar y añadir archivo
    fileOpBtn = document.getElementById('fileOpBtn'),
    fileCheck = document.getElementById('fileCheck'),//Input oculto para gestionar el path
    pageChangeForm = document.getElementById('pageChangeForm')//Elemento de formulario para cambiar paginas;

//Validando input de archivos
docIn.value = "";
var texto = "";
btnFile.addEventListener('click', ()=>{
    //Se mostrara subir
    btnSubir.style.display = "block";
    btnStart.style.display = "none";
    btnStart.disabled = false;
})
docIn.addEventListener('change', () => {
    var isDocx = docIn.value.substr(docIn.value.length - 5);
    var isPdforDoc = docIn.value.substr(docIn.value.length - 4);
    if (docIn.value == "") {
        btnFile.innerHTML = "Selecciona tu archivo";
        btnSubir.disabled = true;
        btnFile.style.backgroundColor = "";
        btnFile.style.backgroundColor = "";
        btnFile.style.color = "";
        btnFile.style.animationName = "";
        btnFile.style.animationDuration = "";
    }else{
        if(((isDocx == ".docx") || (isPdforDoc == ".pdf"))){
            btnFile.innerHTML = docIn.value.replace("C:\\fakepath\\", "");
            btnSubir.disabled = false;
            btnFile.style.borderColor = "";
            btnFile.style.backgroundColor = "";
            btnFile.style.color = "";
            btnFile.style.animationDuration = "";
            btnFile.style.animationName = "";
        }else{
            btnFile.innerHTML = "Archivo no admitido, selecciona uno valido";
            btnSubir.disabled = true;
            btnFile.style.backgroundColor = "red";
            btnFile.style.borderColor = "red";
            btnFile.style.color = "white";
            btnFile.style.animationName = "shake";
            btnFile.style.animationDuration = ".4s";
        }
    }
});
//Enviando y reciviendo peticion del archivo
btnSubir.disabled = true;
var previiusPages = 0;
btnSubir.addEventListener('click', ()=>{
    //Evento del menu del documento
    pdfToolsCnt.style.opacity = "1";
    pdfToolsCnt.style.zIndex = "1";
    loadArea(true, "Cargando",true);
    //Pidiendo informacion
    var datos = new FormData(inForm);
    fetch(direccion+'doc/upload',{
        method: 'POST',
        body: datos
    }).then(function(res){
        return res.json();
    }).then(function(myRes){
        //Mostrando al ususario
        fileCheck.value = myRes.fileName.trim();
        texto = textInfo(myRes.data);
        if (texto.errorMsg) {
            loadArea(true, "¡Lo sentimos! <br/> Puede que el documento este vacio o contenga imagenes <br/> Porfavor ingresa un documento con algo de texto, <button class='btn' id='retryBtn' onClick='deleteArea()'>Intentar de Nuevo</button>",false)
        }else{
            var h = "";
            texto.textoFiltrado.map((x) => {
                h = h + x + " "
            })
            words = texto.longitud;
            pages = myRes.pdfInfo.pages;
            previiusPages = pages;
            texto = h;
            wordsInfo.innerHTML = "Palabras: " + words;
            pageInfo.innerHTML = "Páginas: " + pages;
            infoItem[0].innerHTML = myRes.nameTitle;
            infoItem[1].innerHTML = "Número de páginas: " + pages;
            infoItem[2].innerHTML = "Número de palabras: " + words;
            infoItem[3].innerHTML = h.slice(0, 300) + "...";
            infoItem[4].innerHTML = h;
            loadArea(false, "",false);
        }

    }).catch((e)=>{
        loadArea(true, "¡Lo sentimos! <br/> Ocurrio un problema al cargar tu archivo <br/> <a href='/game'>Intenta de nuevo</a>", false)
    })
})

//Logica del menu de configuracion de pdf
//Boton para cerrar el menu
backBtn.addEventListener('click', ()=>{
    deleteArea();
});
//Funcion para eliminar en el loadArea
function deleteArea(){
    loadArea(true, "Eliminando archivo", true);
    fetch(direccion + `doc/${fileCheck.value}`,{
        method: 'DELETE'
    }).then(function(res){
        return res.json();
    }).then(function(myRes){
        pdfToolsCnt.style.opacity = "";
        pdfToolsCnt.style.zIndex = "";
        loadArea(false, "",true);
    })
}
//Boton para activar el cambio de paginas
swbtn.checked = false;
desdeIn.disabled = true;
hastaIn.disabled = true;
swbtn.addEventListener('change',()=>{
    if(swbtn.checked){
        desdeIn.disabled = false;
        hastaIn.disabled = false;
        avisoPdf.innerHTML = "Se seleccionaran las páginas elegidas";
        btnReady.style.backgroundColor = "#0984e3";
        btnReady.style.borderdColor = "#0984e3";
        btnReady.innerHTML = "Guardar cambios";
        ready = false;
    }else{
        desdeIn.disabled = true;
        hastaIn.disabled = true;
        avisoPdf.innerHTML = "Se seleccionara todo el contenido";
        loadArea(true, "Cargando",true);
        fetch(direccion + `doc/pages/${0}/${previiusPages}/${fileCheck.value}`,{
            method: "POST",
        }).then(function(res){
            return res.json();
        }).then(function(myRes){
            //Mostrando al ususario
            texto = textInfo(myRes.data);
            if (texto.errorMsg) {
                loadArea(true, "¡Lo sentimos! <br/> Puede que el documento este vacio o contenga imagenes <br/> Porfavor ingresa un documento con algo de texto, <button class='btn' id='retryBtn' onClick='deleteArea()'>Intentar de Nuevo</button>",false)
            }else{
                var h = "";
                texto.textoFiltrado.map((x) => {
                    h = h + x + " "
                })   
                words = texto.longitud;
                pages = myRes.pdfInfo.pages;
                texto = h;
                wordsInfo.innerHTML = "Palabras: " + words;
                pageInfo.innerHTML = "Páginas: " + pages;
                infoItem[1].innerHTML = "Número de páginas: " + pages;
                infoItem[2].innerHTML = "Número de palabras: " + words;
                infoItem[3].innerHTML = h.slice(0, 300) + "...";
                infoItem[4].innerHTML = h;
                loadArea(false, "",false);
            }
    
        }).catch((e)=>{
            loadArea(true, "¡Lo sentimos! <br/> Ocurrio un problema al cargar tu archivo <br/> <a href='/game'>Intenta de nuevo</a>", false)
        })
        btnReady.style.backgroundColor = "";
        btnReady.style.borderdColor = "";
        btnReady.innerHTML = "Listo!";
        ready = true;
    }
})

//Validando entrada de las paginas
var desde = 0;
var hasta = 0;
var statusDesde = false;
var statusHasta = false;
var ready = true;
desdeIn.value = 1;
hastaIn.value = 2;
desdeIn.addEventListener('change', ()=>{
    if(desdeIn.disabled != true){
        if(desdeIn.value != "" && desdeIn.value >= 1 && desdeIn.value <= hastaIn.value && desdeIn.value <= previiusPages){
            btnReady.style.backgroundColor = "#0984e3";
            btnReady.style.borderdColor = "#0984e3";
            btnReady.innerHTML = "Guardar cambios";
            ready = false;
            btnReady.disabled = false;
        }else{
            btnReady.style.backgroundColor = "red";
            btnReady.style.borderdColor = "red";
            btnReady.innerHTML = "Entrada invalida";
            btnReady.disabled = true;
        }
    }
})
desdeIn.addEventListener('mouseout', ()=>{
    if(desdeIn.disabled != true){
        if(desdeIn.value != "" && desdeIn.value >= 1 && desdeIn.value <= hastaIn.value && desdeIn.value <= previiusPages){
            btnReady.style.backgroundColor = "#0984e3";
            btnReady.style.borderdColor = "#0984e3";
            btnReady.innerHTML = "Guardar cambios";
            ready = false;
            btnReady.disabled = false;
        }else{
            btnReady.style.backgroundColor = "red";
            btnReady.style.borderdColor = "red";
            btnReady.innerHTML = "Entrada invalida";
            btnReady.disabled = true;
        }
    }
})
hastaIn.addEventListener('change', ()=>{
    if(hastaIn.disabled != true){
        if(hastaIn.value != "" && hastaIn.value >= 1 && hastaIn.value >= desdeIn.value && hastaIn.value <= previiusPages){
            btnReady.style.backgroundColor = "#0984e3";
            btnReady.style.borderdColor = "#0984e3";
            btnReady.innerHTML = "Guardar cambios";
            ready = false;
            btnReady.disabled = false;
        }else{
            btnReady.style.backgroundColor = "red";
            btnReady.style.borderdColor = "red";
            btnReady.innerHTML = "Entrada invalida";
            btnReady.disabled = true;
        }
    }
});
hastaIn.addEventListener('mouseout', ()=>{
    if(hastaIn.disabled != true){
        if(hastaIn.value != "" && hastaIn.value >= 1 && hastaIn.value >= desdeIn.value && hastaIn.value <= previiusPages){
            btnReady.style.backgroundColor = "#0984e3";
            btnReady.style.borderdColor = "#0984e3";
            btnReady.innerHTML = "Guardar cambios";
            ready = false;
            btnReady.disabled = false;
        }else{
            btnReady.style.backgroundColor = "red";
            btnReady.style.borderdColor = "red";
            btnReady.innerHTML = "Entrada invalida";
            btnReady.disabled = true;
        }
    }
});

//Eventos del boton ready
btnReady.addEventListener('click', ()=>{
    if(ready){
        loadArea(true, "Cargando",true);
        fetch(direccion + `doc/${fileCheck.value}`,{
            method: 'DELETE'
        }).then(function(res){
            return res.json();
        }).then(function(myRes){
            loadArea(false, "",false);
            pdfToolsCnt.style.opacity = "";
            pdfToolsCnt.style.zIndex = "";
            btnSubir.style.display = "none";
            btnStart.style.display = "block";
            btnStart.disabled = false;
        })
    }else{
        loadArea(true, "Cargando",true);
        desde = desdeIn.value;
        hasta = hastaIn.value;
        fetch(direccion + `doc/pages/${desde}/${hasta}/${fileCheck.value}`,{
            method: "POST",
        }).then(function(res){
            return res.json();
        }).then(function(myRes){
            //Mostrando al ususario
            texto = textInfo(myRes.data);
            var h = "";
            texto.textoFiltrado.map((x)=>{
                h = h + x + " "
            })
            words = texto.longitud;
            texto = h;
            pages =( hasta - desde) + 1;
            wordsInfo.innerHTML = "Palabras: " + words;
            pageInfo.innerHTML = "Páginas: " + pages;
            infoItem[1].innerHTML = "Número de páginas: " + pages;
            infoItem[2].innerHTML = "Número de palabras: " + words;
            infoItem[3].innerHTML = h.slice(0,300) + "...";
            infoItem[4].innerHTML = h;
            loadArea(false, "",false);
    
        }).catch((e)=>{
            loadArea(true, "¡Lo sentimos! <br/> Ocurrio un problema al cargar tu archivo <br/> <a href='/game'>Intenta de nuevo</a>", false)
        })
        hasta = hastaIn.value;
        desde = desdeIn.value;
        btnReady.style.backgroundColor = "";
        btnReady.innerHTML = "Listo!";
        ready = true;
    }
})

//Boton de engranaje
engranajeOpen = true;
opcionesBtn.addEventListener('click', ()=>{
    if(engranajeOpen){
        configOptions.style.opacity = "1";
        configOptions.style.zIndex = '1';
        opcionesBtn.style.transform = 'rotate(90deg)';
        engranajeOpen = false;
    }else{
        configOptions.style.opacity = "";
        configOptions.style.zIndex = '';
        opcionesBtn.style.transform = '';
        engranajeOpen = true;
    }
})

//Validando textArea y contando palabras
textoIn.value = "";
//Botones de copiar y añadir archivo
var sAndC = false;

copyOpBtn.addEventListener('click',()=>{
    words = 0;
    pages = 0;
    btnFile.value = "";
    btnFile.innerHTML = "Selecciona tu archivo";
    btnSubir.disabled = true;
    sAndC = false;
    btnSubir.style.display = "none";
    btnStart.style.display = "block";
    btnStart.disabled = true;

});
fileOpBtn.addEventListener('click',()=>{
    msg.style.display = "none";
    words = 0;
    textoIn.value = "";
    sAndC = true;
    btnSubir.style.display = "block";
    btnStart.style.display = "none";
    btnStart.disabled = false;

})
//Esta funcion ahorra lineas de codigos ya que se ejecuta lo mismo en cada evento
function eventText() {
    texto = textoIn.value;
    var info = textInfo(texto);
    words =  "Palabras: " + 0;
    if(info.longitud && info.longitud != undefined){
        words = "Palabras: " + info.longitud;
    }
    wordsInfo.innerHTML = words;
    //Validando el mensaje y el boton de comenzar
    if ((info.longitud < 50) || (info.errorMsg)){
        msg.style.display = "block";
        msg.style.color = "red";
        msg.innerHTML = "Necesitas al menos 50 palabras";
        btnStart.disabled = true;

    } else {
        msg.style.color = "Green";
        msg.innerHTML = "Excelente!"
        btnStart.disabled = false;
    }
}
textoIn.addEventListener('focusin', () => { eventText() });
textoIn.addEventListener('focusout', () => { eventText() });
textoIn.addEventListener('keyup', () => { eventText() });
textoIn.addEventListener('keydown', () => { eventText() });
textoIn.addEventListener('change', () => { eventText() });

//Velocimetro
velInfo.innerHTML = "Palabras/min: " + velocidad;
velPP.addEventListener('click', () => {
    if (velocidad <= 500) {
        velocidad = velocidad + 5;
        velInfo.innerHTML = "Palabras/min: " + velocidad;
    }
});
velMM.addEventListener('click', () => {
    if (velocidad > 50) {
        velocidad = velocidad - 5;
        velInfo.innerHTML = "Palabras/min: " + velocidad;
    }
});

//Esta funcion filtra el texto seleccionado devuelve un array y su longitud
function textInfo(x) {
    var texto = [];
    var textoFiltrado = [];
    var info;
    texto = x.replaceAll('\n', ' ');
    texto = texto.trim().split(" ");
    if(texto.length >= 1 && x != ''){
        //Hay texto
        for (const i of texto) {
            if ((i != "") && (i != undefined)) {
                textoFiltrado.push(i);
            }
        }
        info = { textoFiltrado, longitud: textoFiltrado.length }
    }else{
        info = {errorMsg: true}
    }
    
    return info;
}

//Esta funcion calcula el tiempo que se tardaran en mostrar las palabras segun la velocidad y cantidad de estas
function calcTime(Lpalabras, vel) {
    var minute = 60000;//Un minuto en ms
    var timeInfo;
    var totalTime = (Lpalabras * minute) / vel;
    timeInfo = { totalTime, timepWord: totalTime / Lpalabras }
    return timeInfo;
}


//Logica del juego
var btnStarStatus = 0;
btnStart.disabled = true;
btnStart.addEventListener('click', () => {
    switch (btnStarStatus) {
        case 0:
            //Comenzar
            velMM.disabled =true;
            velPP.disabled = true;
            ppv.disabled = true;
            var info = textInfo(texto);
            if (info.longitud < 50) {
                gameArea.style.display = "";
                inForm.style.display = "";
                rbtn.style.display = "";
                msg.style.display = "";
            } else {
                gameArea.style.display = "grid";
                inForm.style.display = "none"
                msg.style.display = "none";
                rbtn.style.display = "none";
                startGame();
            }
            btnStart.innerHTML = "Pausa";
            btnStart.style.backgroundColor = "#f39c12";
            btnStart.style.borderColor = "#f39c12";
            btnStarStatus = 1;
            break;
        case 1:
            //pausa
            velMM.disabled = false;
            velPP.disabled = false;
            ppv.disabled = false;
            pauseGame();
            break;

        default:
            //Play
            playGame();
            break;
        
    }

});

//Esta funcion se encarga de mostrar las palabras dependiendo de la velocidad y la cantidad de palabras
var t = 0;//Variable de control
var y; //Esta variable sera del timeout
var countW = 0; //Esta variable servira para controlar el numero de palabras que se mostraran por vez
var palabrasPVez = 1;
ppv.value = 1;
var currentTime = 0; //Esta variable llevara el conteo del tiempo trascurrido
var previusPpv = ppv.value;
ppv.addEventListener('change', () => {
    if(ppv.value != 1 && ppv.value != 2 && ppv.value != 3 && ppv.value != 4){
        palabrasPVez = previusPpv;
        ppv.value = previusPpv;
    }else{
        palabrasPVez = ppv.value;
        previusPpv = palabrasPVez;
    }
})
ppv.addEventListener('mouseout', () => {
    if(ppv.value != 1 && ppv.value != 2 && ppv.value != 3 && ppv.value != 4){
        palabrasPVez = previusPpv;
        ppv.value = previusPpv;
    }else{
        palabrasPVez = ppv.value;
        previusPpv = palabrasPVez;
    }
})
function showGame(time, words, len) {
        y = setTimeout(() => {
        //console.log("Comenzo el ciclo el tiempo es de " + time + ", vuelta " + t);
        //Aqui se muestra el texto en pantalla
        if (palabrasPVez == 1) {
            textShow.innerHTML = "";
           if(countW < palabrasPVez){
                if(words[t] != undefined){ textShow.innerHTML = textShow.innerHTML + " " + words[t];}
                countW++
           }else{
                textShow.innerHTML = "";
                t = t -1;
                countW = 0;
           }
        } else {
            textShow.innerHTML = "";
            var w = "";
            for(var u = 0; u < palabrasPVez; u++){
                if(words[t] != undefined){
                    w = w + " " + words[t];
                }
                t++
            }
            textShow.innerHTML = textShow.innerHTML + " " + w;
            t--;
            //currentTime = currentTime - time;
        }
        //console.log("vez: " + t + "palabra: " + textShow.innerHTML)
        currentTime = currentTime + time;
        //console.log('El tiempo es de ' + currentTime)
        //console.log('Termino el ciclo');
        
        if (t < len) {
            showGame(time, words, len);
        } else {
            t = len;
            clearInterval(y);
            msg.innerHTML = "Tiempo transcurrido: " + revertTime(currentTime) + "     Palabras leidas: " + t;
            msg.style.display = "block";
            t = 0;
            currentTime = 0;
            btnStart.innerHTML = "Reiniciar";
            btnStart.style.backgroundColor = "";
            btnStart.style.borderColor = "";
            btnStarStatus = 0;
            resetBtn.style.visibility = "visible";
            velMM.disabled = false;
            velPP.disabled = false;
        }
        t++;
    }, time);

}

//Esta funcion se encarga de arrancar el juego
function startGame() {
    var textGame = textInfo(texto);
    var timeGame = calcTime(textGame.longitud, velocidad);
    showGame(timeGame.timepWord, textGame.textoFiltrado, textGame.longitud);

}
//Esta funcion reauna el juego cuando se pauso
function playGame(){
    //Control del boton reset
    resetBtn.style.visibility = "";
    if(t != 0){
        btnStart.innerHTML = "Pausa";
        btnStart.style.backgroundColor = "#f39c12";
        btnStart.style.borderColor = "#f39c12";
        btnStarStatus = 1;
        velMM.disabled = true;
        velPP.disabled = true;
        ppv.disabled = true;
        
    }else{
        btnStart.innerHTML = "Reiniciar";
        btnStart.style.backgroundColor = "";
        btnStart.style.borderColor = "";
        velMM.disabled = false;
        velPP.disabled = false;
        ppv.disabled = false;
    }
    //Control de los mensajes
    msg.style.display = "";
    msg.setAttribute('class', '');
    msg.innerHTML = "";
    
    startGame();
}
//Esta funcion pausa el fuego
function pauseGame (){
    //Control de pausa
    //Control del boton reset
    resetBtn.style.visibility = "visible";
    btnStart.innerHTML = "Play";
    btnStart.style.backgroundColor = "";
    btnStart.style.borderColor = "";
    clearTimeout(y);
    btnStarStatus = 2;
    //Control de los mensajes
    msg.style.display = "block";
    msg.innerHTML = "¡En Pausa!\n" + "Tiempo transcurrido: " + revertTime(currentTime) + "     Palabras leidas: " + t;
    msg.setAttribute('class', 'currentInfo');
}

//El siguiente btn controla el reset del juego
resetBtn.addEventListener('click', ()=>{
    t = 0;
    currentTime = 0;
    countW = 0;
    btnStarStatus = 0;
    gameArea.style.display = "";
    inForm.style.display = "";
    rbtn.style.display = "";
    msg.style.display = "";
    clearTimeout(y);
    btnStart.innerHTML = "Comenzar";
    btnStart.style.backgroundColor = "";
    btnStart.style.borderColor = "";
    resetBtn.style.visibility = "hidden";
    velMM.disabled = false;
    velPP.disabled = false;
    ppv.disabled = false;
    msg.setAttribute('class', '');
    if(sAndC){
        //Se mostrara subir
        btnSubir.style.display = "block";
        btnStart.style.display = "none";
        btnStart.disabled = false;
    }else{
        //Se mostrara comenzar
        btnSubir.style.display = "none";
        btnStart.style.display = "block";
        btnStart.disabled = false;
    }
});

//Esta funcion se encargara de convertir milisegundos a segundos y minutos
function revertTime(x){
    var minutes = x / 60000;//Convertira a minutos

    if(minutes < 1){
        //Son segundos
        return (minutes.toFixed(2) * 60).toFixed(2) + " seg";
    }else{
        return minutes.toFixed(2) + " min";
    }
}

//Funcion para el modo oscuro
var sun = true;
sunNmoon.addEventListener('click', () => {
    if (sun) {
        gameContent.style.backgroundColor = "rgba(44, 62, 80, 0.8)";
        gameContent.style.color = "white";
        configOptions.style.backgroundColor = "#2c3e50";
        configOptions.style.color = "white";
        encabezado.style.backgroundColor = "rgba(44, 62, 80, 0.8)";
        sunNmoon.setAttribute("src", "img/iconos/sun-solid.png");
        bgChange.setAttribute("src", "img/iconos/image-regularW.png");
        opcionesBtn.setAttribute("src", "img/iconos/cog-solidW.png");
        imgHead.setAttribute('src', 'img/Sin títuloTrasparenteW.svg');
        slideCnt.style.backgroundColor = "#2c3e50";
        slideCnt.style.color = "white";
        loadCnt.style.backgroundColor = "#2c3e50";
        loadCnt.children[0].children[1].style.color = "white";
        loadCnt.children[0].children[0].setAttribute('src','img/iconos/loading-processW.svg');
        completeText.style.backgroundColor = "#2c3e50";
        infoItem[3].style.backgroundColor = "#17212b";
        completeText.style.color = "white";
        sun = false;
    } else {
        infoItem[3].style.backgroundColor = "";
        gameContent.style.backgroundColor = "";
        gameContent.style.color = "";
        configOptions.style.backgroundColor = "";
        configOptions.style.color = "";
        encabezado.style.backgroundColor = "";
        sunNmoon.setAttribute("src", "img/iconos/moon-solid.svg");
        bgChange.setAttribute("src", "img/iconos/image-regular.svg");
        opcionesBtn.setAttribute("src", "img/iconos/cog-solid.svg");
        imgHead.setAttribute('src', 'img/Sin títuloTrasparente.svg');
        slideCnt.style.backgroundColor = "";
        slideCnt.style.color = "";
        loadCnt.style.backgroundColor = "";
        loadCnt.children[0].children[1].style.color = "";
        loadCnt.children[0].children[0].setAttribute('src','img/iconos/loading-process.svg');
        completeText.style.backgroundColor = "";
        completeText.style.color = "";
        sun = true;
    }
});

//Funcion del fondo
document.body.style.backgroundImage = "url('img/Backgrounds/img6.jpg')";
var bgCount = 0;


bgChange.addEventListener('click', () => {
    backgroundchange(bgCount)
});

document.body.addEventListener('load',()=>{
    for(var i = 0; i < 6; i++){
        backgroundchange(bgCount)
    }
})
//Funcion que cambia el bg
function backgroundchange(x){
    switch (x) {
        case 0:
            document.body.style.backgroundImage = "url('img/Backgrounds/img1.jpg')";
            bgCount = 1;
            break;
        case 1:
            document.body.style.backgroundImage = "url('img/Backgrounds/img2.jpg')";
            bgCount = 2;
            break;
        case 2:
            document.body.style.backgroundImage = "url('img/Backgrounds/img3.jpg')";
            bgCount = 3;
            break;
        case 3:
            document.body.style.backgroundImage = "url('img/Backgrounds/img4.jpg')";
            bgCount = 4;
            break;
        case 4:
            document.body.style.backgroundImage = "url('img/Backgrounds/img5.jpg')";
            bgCount = 5;
            break;
        default:
            document.body.style.backgroundImage = "url('img/Backgrounds/img6.jpg')";
            bgCount = 0;

    }
}

//La siguiente funcion abre o cierra el area de cargado 
var f;
function loadArea(abrir, a, nodanger) {
    var count = 0;
    loadCnt.children[0].children[1].innerHTML = a;
    if (nodanger) {
        if (abrir) {
            if(sun == true){
                loadCnt.children[0].children[0].setAttribute('src', 'img/iconos/loading-process.svg');
                loadCnt.style.backgroundColor = "";
                loadCnt.children[0].children[1].style.color = "";
                loadCnt.style.border = "";

            }else{
                loadCnt.style.backgroundColor = "#2c3e50";
                loadCnt.children[0].children[1].style.color = "white";
                loadCnt.children[0].children[0].setAttribute('src','img/iconos/loading-processW.svg');
                loadCnt.style.border = "";
            }
            
            loadCnt.style.opacity = "1";
            loadCnt.style.zIndex = "1";
            loadCnt.children[0].children[0].style.animationName = "rotateAll";
            loadCnt.children[0].children[1].style.animationName = "parpadeo";
            f = setInterval(() => {
                switch (count) {
                    case 0:
                        loadCnt.children[0].children[1].innerHTML = loadCnt.children[0].children[1].innerHTML + ".";
                        count = 1;
                        break;
                    case 1:
                        loadCnt.children[0].children[1].innerHTML = loadCnt.children[0].children[1].innerHTML + "..";
                        count = 2;
                        break;
                    case 2:
                        loadCnt.children[0].children[1].innerHTML = loadCnt.children[0].children[1].innerHTML + "..";
                        count = 3;
                        break;
                    default:
                        loadCnt.children[0].children[1].innerHTML = a;
                        count = 0;
                        break;
                }
            }, 1000)
        } else {
            clearInterval(f);
            loadCnt.style.opacity = "";
            loadCnt.style.zIndex = "";
            loadCnt.children[0].children[0].style.animationName = "";
            loadCnt.children[0].children[1].style.animationName = "";
            loadCnt.children[0].children[1].innerHTML = "";
        }
    } else {
        clearInterval(f);
        loadCnt.children[0].children[0].style.animationName = "";
        loadCnt.children[0].children[1].style.animationName = "";
        if(abrir){
            loadCnt.style.opacity = "1";
            loadCnt.style.zIndex = "1";
            loadCnt.children[0].children[0].setAttribute('src', 'img/iconos/exclamation-circle-solid.svg');
            loadCnt.children[0].children[0].setAttribute('alt', 'Error')
            loadCnt.children[0].children[1].style.color = "red";
            loadCnt.style.border = "10px solid red";
            loadCnt.style.animationName = "shake";
            loadCnt.style.animationDuration = "0.3s";
            loadCnt.style.backgroundColor = "#f7c6c5";
        }else{
            loadCnt.style.opacity = "";
            loadCnt.style.zIndex = "";
            loadCnt.children[0].children[1].innerHTML = "";
            loadCnt.style.border = "";
            loadCnt.style.animationName = "";
            loadCnt.style.animationDuration = "";
            loadCnt.style.backgroundColor = "";
        }
    }
}
