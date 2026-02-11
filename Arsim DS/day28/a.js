let btnCircle = document.getElementById("btnCircle");
let btnRect = document.getElementById("btnRect");

let circle = document.getElementById("circle");
let rect = document.getElementById("rect");

btnCircle.onclick = function() {
    circle.setAttribute("class", "rrethi");
}

btnRect.onclick = function() {
    rect.setAttribute("class", "katrori");
}