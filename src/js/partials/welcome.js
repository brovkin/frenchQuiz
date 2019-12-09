$(document).mousemove(function(event){
    let xPos = (event.clientX/$(window).width())-0.5,
        yPos = (event.clientY/$(window).height())-0.5,
        box = $('.logo__img');

    TweenLite.to(box, 0.6, {
        rotationY: 50 * xPos,
        rotationX: -50 * yPos,
        ease: Power1.easeOut,
        transformPerspective: 900,
        transformOrigin: 'center'
    });
});

$('.welcome__btn').on('click', function(){
    $(this).closest('.welcome').hide(1);

    $('.app').show(1);

    let minutes = 0;
    let seconds = 0;
    // function from timer.js
    timer(minutes, seconds);
});

