let inp1 = document.getElementById("inp1");
let inp2 = document.getElementById("inp2");
let btn1 = document.getElementById("btn1");

function sum(x=88,y= 77) {
    return x + y;
}

btn1.onclick = function() {
    document.write(sum(+inp1.value, +inp2.value));
}


