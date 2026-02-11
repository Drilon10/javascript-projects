let clock = document.getElementById('clock');

function showCurrentTime() {
    let currentTime = new Date();

    let hours = currentTime.getHours();
    let mins = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();

    let clockTime = `${hours}:${mins}:${seconds}`;

    clock.innerText = clockTime;

    changeImage();
}

setInterval(showCurrentTime, 1000);

let wakeUpTime;
let schoolTime;
let sleepTime;

function changeImage() {
    let time = new Date().getHours();
    let image = "img/ds_clock.png";
    let imageHTML = document.getElementById("timeImage");

    if(time == wakeUpTime) {
        image = "img/morning.gif";
    }

    else if(time == schoolTime) {
        image = "img/class.gif";
    }

    else if(time == sleepTime) {
        image = "img/night.gif";
    }

    else {
        image = "img/ds_clock.png";
    }

    imageHTML.src = image;
}


function updateClock() {
    let wakeUpTimeSelector = document.getElementById("wakeUpTimeSelector");
    let schoolTimeSelector = document.getElementById("schoolTimeSelector");
    let sleepTimeSelector = document.getElementById("sleepTimeSelector");

    wakeUpTime = wakeUpTimeSelector.value;
    schoolTime = schoolTimeSelector.value;
    sleepTime = sleepTimeSelector.value;

}

let saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener('click', function() {
    updateClock();
});
