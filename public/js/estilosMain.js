let section = document.getElementsByTagName("section");
let next = document.getElementById("next"); //botón siguiente
let bodyContainer = document.getElementById("container");
let counter = 0; //variable que me va a mover el contenido de los sections

bodyContainer.style.opacity = 1;


next.addEventListener("click", movePage);

function movePage()
{   counter ++; 
    switch (counter){
        case 0: 
            section[counter].style.display = "flex";
            section[counter+1].style.display = "none";
            section[counter+2].style.display = "none";
        break;
        case 1: 
            section[counter].style.display = "flex";
            section[counter+1].style.display = "none";
            section[counter-1].style.display = "none";
            
        break;
        case 2:
            section[counter].style.display = "flex";
            section[counter-1].style.display = "none";
            section[counter-2].style.display = "none";
        break;
        default:
            location.href = location.href + "game";
        break;
    }}
