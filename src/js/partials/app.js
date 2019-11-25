'use strict'

// пронумеруем вопросы

let questionArr = document.querySelectorAll('.app__element');

let question = document.querySelector('.app__element[data-position="current"]');
question.style.display = 'block';

let questionNumber = 0;

// сделаем обработчик нажатия на checkbox

let el = document.querySelectorAll('.variants-block');

function checkbox(event) {

    let target = event.target;

    let check = document.querySelector('.btn-block__check');

    let inputs = document.querySelectorAll('.variants-block__checkbox');

    check.disabled = false;

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
    }

    if (target.tagName != 'INPUT') return;

    if (!target.checked) {
        target.checked = true;
    }
}

for (let i = 0; i < el.length; i++) {
    el[i].addEventListener('click', checkbox);
}

// проверим правельность вопроса

var check = document.querySelector('.btn-block__check');

function checkQuestion(event) {
    let inputs = document.querySelectorAll('.variants-block__checkbox'),
        nextBtn = document.querySelector('.btn-block__next'),
        block = document.querySelector('.variants-block');

    for (let i = 0; i < inputs.length; i++) {

        let variant = inputs[i].parentNode.dataset.true;

        if (inputs[i].checked && variant == 'yes') {
            inputs[i].parentNode.style.backgroundColor = 'green';

            block.style.pointerEvents = 'none';

            nextBtn.style.display = 'block';
            check.style.display = 'none';
        } else {

            let trueVariant = document.querySelector('.variants-block__variant[data-true="yes"]');

            block.style.pointerEvents = 'none';

            if (inputs[i].checked) {
                inputs[i].parentNode.style.backgroundColor = 'red';
                trueVariant.style.backgroundColor = 'green';

                nextBtn.style.display = 'block';
                check.style.display = 'none';
            }
        }

    }

}

// создадим массив куда будет складывать правильные и
// не правильные ответы

var questionSelectArr = {};

for(let i = 0; i < questionArr.length; i++) {
    questionSelectArr[i] = {};
}


// создадим функцию которая будет помещать эти ответы в массив

function questionSelect(elem) {

    elem.forEach((el, i) => {

        if (el.parentNode.dataset.true) {
            questionSelectArr[questionNumber].right = el.parentNode.lastElementChild.innerHTML;

        } else if (el.checked) {
            questionSelectArr[questionNumber].wrong = el.parentNode.lastElementChild.innerHTML;
        }

    });
}


check.addEventListener('click', checkQuestion);

// переключение вопроса

var nextBtn = document.querySelector('.btn-block__next');

function nextQuestion() {

    let mainBlock = document.querySelector('.app__element');

    let question = document.querySelector('.app__element[data-position="current"]');

    let variants = question.querySelectorAll('.variants-block__checkbox');

    questionSelect(variants);

    question.dataset.position = '';
    question.style.display = 'none';

    question.nextElementSibling.dataset.position = 'current';
    question.nextElementSibling.style.display = 'block';

    check.style.display = 'block';
    check.disabled = true;
    nextBtn.style.display = 'none';

    questionNumber++;

    if (questionNumber == questionArr.length) {
        document.querySelector('.btn-block__result').style.display = 'block';
        check.style.display = 'none';
    }

    if (questionNumber == questionArr.length - 1) {
        nextBtn.value = 'Закончить тест';
    }

    mainBlock.remove();
}

nextBtn.addEventListener('click', nextQuestion);

// найдем кнопку для показа результатов

var resultBtn = document.querySelector('.btn-block__result');

// найдем кнопку для перезагрузки страницы

var againBtn = document.querySelector('.btn-block__again');

// напишем функцию которая считает процент правильных ответов

function showTotal(countQuestions, wrong) {
    let result = (wrong / countQuestions * 100) - 100;

    if (wrong == 0) {
        result = 100;
    } else if (countQuestions == wrong) {
        result = 0;
    }

    let slashBlock = document.querySelector('.total-block__result-block');

    slashBlock.innerHTML = countQuestions - wrong + ' / ' + countQuestions;

    return Math.abs(result);
}

// напишем функцию которая показывает результат

function showResult() {
    let resultBlock = document.querySelector('.result-block');
    let questionWrongCount = 0;
    for (let item in questionSelectArr) {

        let questionTitle = document.createElement('div');
        questionTitle.className = 'result-block__list-item result-block__question-title';
        questionTitle.innerHTML = 'Вопрос № ' + (+item + 1);

        let questionAnswerRight = document.createElement('div');
        questionAnswerRight.className = 'result-block__list-item result-block__question-answer_right';
        questionAnswerRight.innerHTML = questionSelectArr[item].right;

        let questionAnswerWrong = document.createElement('div');
        questionAnswerWrong.className = 'result-block__list-item result-block__question-answer_wrong';
        questionAnswerWrong.innerHTML = questionSelectArr[item].wrong;

        let questionIconRight = document.createElement('i');
        questionIconRight.className = 'fa fa-check';

        let questionIconWrong = document.createElement('i');
        questionIconWrong.className = 'fa fa-times';

        let resultCont = document.createElement('div');
        resultCont.className = 'result-block__question';
        resultCont.append(questionTitle);
        resultCont.append(questionAnswerRight);

        if (questionSelectArr[item].wrong !== undefined) {
            resultCont.append(questionAnswerWrong);
            resultCont.append(questionIconWrong);
            questionWrongCount++;
        } else {
            resultCont.append(questionIconRight);
        }



        resultBlock.append(resultCont);

        resultBtn.disabled = 'disabled';

        againBtn.style.display = 'block';
    }

    let total = Math.floor(showTotal(questionArr.length, questionWrongCount));

    let totalBlock = document.querySelector('.total-block');

    totalBlock.style.display = 'flex';

    let totalValue = document.querySelector('.total-block__value');

    totalValue.innerHTML = 0;

    if (total !== 0) {

        let interval = setInterval(function(){

            totalValue.innerHTML++;

            if (totalValue.innerHTML == total) {
                clearInterval(interval);
            }

        }, 30);

    }

}

resultBtn.addEventListener('click', showResult);

againBtn.addEventListener('click', function(){
    window.location.reload();
});




