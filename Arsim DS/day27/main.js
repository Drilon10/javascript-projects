function sayHello() {
    alert(9*2);
}

// sayHello();

function shuma(num1, num2) {
    document.write((num1 + num2) + "<br>");
}

let shfaqMesazhin = name => alert(`Hello ${name}`)
// shfaqMesazhin("Arsim");
// shuma(7,5);

let text = "Blla blla";

function dsFunc() {
    let localVar = "Digital School";
}

// console.log(localVar)

//Shkruje nje funksion i cili i konverton minutat ne sekonda.

let shkolla = {
    name: "DS",
    subject: "programming",
    students: 250,
    year: 2019,
    startEngine: function() {
        alert("Vrooom")
    }
}

// let skills = ["HTML", "CSS"];

// console.log(skills[1])

// alert(shkolla.startEngine());

let computer = new Object();

computer.name = "Lenovo";
computer.CPU = "i7 core";
computer.ram = "32GB";

// console.log(computer)

function kompjuteret(name, cpu, ram) {
    this.name = name;
    this.cpu = cpu;
    this.ram = ram;
}

let comp1 = new kompjuteret("ACER", "i5 core", "8gb");
let comp2 = new kompjuteret("DELL", "i7 core", "16gb");