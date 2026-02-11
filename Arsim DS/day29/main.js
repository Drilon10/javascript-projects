let inp = document.getElementById('input1');
let btn = document.getElementById('btn1');
let btnShow = document.getElementById('btnShow');

let skills = ['HTML', "CSS", "Javascript", "PHP"];

skills.push("Java"); // PUSH shton ne fund te listes (arrayt)
skills.push("Test"); 

skills.pop(); //POP fshin elementin e fundit te arrayt

skills.unshift("Python"); //shton ne fillim te listes

skills.shift(); //Shift fshin elementin e pare

skills.splice(1, 3, "mySql");

btn.addEventListener('click', function() {
    let newSkill = inp.value; //Java
    skills.push(newSkill);
    inp.value = "";
    
});

btnShow.addEventListener('click', function() {
    // document.write(skills);
})

document.write(Math.floor(Math.random()*5))


document.write("<br>");


let students = ["Arsim", "Bujar"];

let numrat = [1,2,3,4,5,6,7,8,9,10];

let [iPari, iDyti, ...numratTjere] = numrat;

console.log(iPari);
console.log(iDyti);
console.log(numratTjere);


let [st1, st2] = students;

// console.log(st1);