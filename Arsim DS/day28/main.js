let butoni = document.getElementById("btn1");
let over = document.getElementById("btn2");
let leave = document.getElementById("btn3");
let wheel = document.getElementById("btn4");

// let teksti = document.querySelector("h1");

// butoni.onclick = function() {
//     alert("Button pressed!");
// }

butoni.addEventListener('click', function() {
    alert("Button pressed!");
});

// butoni.addEventListener('click', function() {
//     document.write("Button pressed second");
// });

// teksti.onclick = function() {
//     alert("Text pressed!");
// }

over.addEventListener('mouseover', function() {
    alert("Button hovered");
})

leave.addEventListener('mouseleave', function() {
    alert("Button left");
})

wheel.addEventListener('mousewheel', function() {
    alert("Button scrolled");
})