
// $('#btn').click(function(){
//     $('#title').text('Arsim');
//     $('#title').append('Baftijari');
// })

// $('button')
//     .click(function() {
//         $(this).addClass('clicked');
//     })
//     .find('span')
//     .attr('title', 'Hover over me');

$('#btn').click(function() {
    $('.hidden').show('slow');
})

$('#btn1').click(function() {
    $('.hidden').hide('slow');
})

$('#square').click(function() {
    $('#square').animate({
        'width': '300px',
        'height': '300px',
        'fontSize' : '100px'
    })
})