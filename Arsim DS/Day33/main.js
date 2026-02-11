let name_error = document.getElementById('name_error');
let age_error = document.getElementById('age_error');

function validation() {
    event.preventDefault();
    let name1 = document.getElementById('name');
    let validName = /^[A-Za-z]+$/;   
    
    let age = document.getElementById('age');
    let validAge = /^[0-9]+$/;

    if(!(name1.value.match(validName)) || !(age.value.match(validAge))) {

        if(!(name1.value.match(validName))) {
            name_error.style.visibility = 'visible';
            name1.style.borderColor = 'red';
        }

        else {
            name_error.style.visibility = 'hidden';
            name1.style.borderColor = 'black';
        }


        if(!(age.value.match(validAge))) {
            age_error.style.visibility = 'visible';
            age.style.borderColor = 'red';
        }

        else {
            age_error.style.visibility = 'hidden';
            age.style.borderColor = 'black';
        }
    }
}