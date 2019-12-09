const timer = (minutes, seconds) => {
    let minutesBlock = document.querySelector('.timer__minutes');
    let secondsBlock = document.querySelector('.timer__seconds');
    setInterval(function(){
        seconds++;

        if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
        }

        if (seconds < 10) {
            secondsBlock.innerHTML = '0' + seconds;
        } else {
            secondsBlock.innerHTML = seconds;
        }

        if (minutes < 10) {
            minutesBlock.innerHTML = '0' + minutes;
        } else {
            minutesBlock.innerHTML = minutes;
        }


        console.log(seconds);
    }, 1000, function(){
        timer(minutes, seconds);
    });
};



