let nrSelect = document.getElementById('nrSelect');
let guess = document.getElementById('btnGuess');

let count = 1;

let guessNumber = false;

guess.onclick = function() {
    count = 1;
    guessNumber = false;

    while(guessNumber == false) {
        let random = Math.floor(Math.random()*6);
        console.log(random);


        if(nrSelect.value == random) {
            guessNumber = true;
            document.write("Guessed within: " + count + " times");
        }

        else {
            count = count + 1;
        }
    }
}