// https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

//Get the button:
let totop = document.getElementById("js-page--to-top");
let tobottom = document.getElementById("js-page--to-bottom");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    totop.style.display = "block";
  } else {
    totop.style.display = "none";
    tobottom.style.display = "block";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  tobottom = document.getElementById("js-page--to-bottom");
  tobottom.style.display = "block"
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function bottomFunction() {
  tobottom = document.getElementById("js-page--to-bottom");
  if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
    tobottom.style.display = "none"
    // get the scroll height of the window
    const scrollHeight = document.body.scrollHeight;
    // scroll to the bottom of webpage
    window.scrollTo(0, scrollHeight);
  }
}
