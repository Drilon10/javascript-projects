// function printoEmrat() {
//     document.write("Arsim");
//     document.write("<br>");
//     setTimeout(function() {
//        document.write("Bujar"); 
//     }, 3000);

//     document.write("Blerim");
// }

// printoEmrat();

// let ngjyrat = ['red', 'green', 'blue', 'purple', 'cyan'];

// function changeBgColor() {
//     document.querySelector("body").style.backgroundColor = 
//     ngjyrat[Math.floor(Math.random()*ngjyrat.length)];
// }


// setInterval(changeBgColor, 1000);

let circle = document.getElementById('circle');
let showTime = document.getElementById('time');
let startTime = new Date().getTime();

function showCircle() {
    circle.style.display = 'block';
    circle.style.top = Math.random() * 600 + "px";
    circle.style.left = Math.random() * 1000 + "px";
    startTime = new Date().getTime();
    circle.style.backgroundColor = randomColor();
}

showCircle();

circle.onclick = function() {
    circle.style.display = 'none';
    setTimeout(showCircle, 1000);
    let endTime = new Date().getTime();
    let time = (endTime - startTime)/1000;
    showTime.innerHTML = time + " sekonda";
}

function randomColor() {
    let hex = '0123456789ABCDEF';
    let color = "#";

    for(let i = 0; i < 6; i++) {
        color = color + hex[Math.floor(Math.random()*16)];
    }

    console.log(color);

    return color;
}