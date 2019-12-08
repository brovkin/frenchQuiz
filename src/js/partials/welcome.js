$(document).mousemove(function(event){
    var xPos = (event.clientX/$(window).width())-0.5,
        yPos = (event.clientY/$(window).height())-0.5,
        box = $('.logo__img');

    TweenLite.to(box, 0.6, {
        rotationY: 10 * xPos,
        rotationX: 50 * yPos,
        ease: Power1.easeOut,
        transformPerspective: 900,
        transformOrigin: 'center'
    });
});

