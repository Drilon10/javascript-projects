// for(let i = 0; i <= 500; i++){
//     document.write(`The number is: ${i} <br>`);
// }

let person = {
    firstName: "Arsim",
    lastName: "Baftijari",
    age: 15
}

let names = ['Arsim', "Bujar", "Bedri"];

let text = '';
// for(let x in person) {
//     document.write(person[x]);
// }

for(n of names) {
    // document.write(n + "<br>");
}

let shkolla = "Eqrem Cabej";

for(sh of shkolla) {
    // document.write(sh + "<br>")
}

numri = 1;

while(numri < 11) {
    document.write("Numri: " + numri + "<br>");
    numri++;
}