function toggleMenu() {
  let getMenu = document.querySelector(".js-menu-hamburger--black");
  getMenu.classList.toggle("js-menu-hamburger--red");
}
let getHamburger = document.querySelector(".js-menu-hamburger");
getHamburger.addEventListener("click", toggleMenu);


let btn = document.getElementById("js-instructions");
let clicked = true;
function toggleInstructions() {
    let getInstructions = document.querySelector(".js-display-instructions--closed");
    getInstructions.classList.toggle("js-display-instructions--open");

    if (!clicked) {
	clicked = true;
	btn.innerHTML= "Open Instructions";
    }else{
	clicked = false;
	btn.innerHTML = "Close Instructions";
    }
}
/*
let getDisplay = document.querySelector(".js-display-instructions");
getDisplay.addEventListener("click", toggleInstructions);
*/



function toggleText() {
    if (!clicked) {
	clicked = true;
	btn.innerHTML= "Open Instructions";
    }else{
	clicked = false;
	btn.innerHTML = "Close Instructions";
    }
/*    let btn = document.getElementById("mybtn");
    btn.value = 'my value'; // will just add a hidden value
    btn.innerHTML = 'changed';*/
}
