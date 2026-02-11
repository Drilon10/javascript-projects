// let x = 3;

// if(x < 3) {
//     document.write("X eshte me i vogel se 3");
// }

// else if(x == 3) {
//     document.write(`X eshte i barabarte me 3`);
// }

// else {
//     document.write("X eshte me i madh");
// }

let inp = document.querySelector("#inp1");
let btn = document.querySelector("#btn1");
let txt = document.querySelector("#txt1");

btn.onclick = function() {
    txt.innerHTML = inp.value;
    inp.value = '';
}