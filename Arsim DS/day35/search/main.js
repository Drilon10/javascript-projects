function search() {

    let searchInput, filter, ul, li, a, i, txtValue;

    searchInput = document.getElementById('searchInput');

    filter = searchInput.value.toUpperCase();
    ul = document.getElementById('myList');
    li = ul.getElementsByTagName("li");

    for(i = 0; i < li.length; i++) {
        a = li[i];

        txtValue = a.textContent;

        if(txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "block";
        }

        else {
            li[i].style.display = "none";
        }
    }


}