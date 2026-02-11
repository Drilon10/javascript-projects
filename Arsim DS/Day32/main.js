let text = "The best school is Digital School";

// let result = text.search("Digital");

// let result = text.replace("Digital School", "Eqrem Cabej");

// let result = new RegExp('Digital');

let result = /school/g;

let h1 = document.getElementById('res');

h1.innerHTML = text.match(result);

