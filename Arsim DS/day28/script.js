let butoni = document.getElementById("btn1");
let remove = document.getElementById("btn2");
let emri = document.getElementById("emri");

butoni.addEventListener('click', function() {
    // emri.style.color = "red";
    // emri.style.backgroundColor = "yellow";

    // emri.style.cssText = "color: red; background-color: blue";

    emri.setAttribute("class", "arsim");
})

remove.addEventListener('click', function() {
    emri.setAttribute("class", "dr");
})