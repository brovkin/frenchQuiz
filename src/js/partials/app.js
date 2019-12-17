'use strict'

// пронумеруем вопросы

let questionArr = document.querySelectorAll('.app__element');

let question = document.querySelector('.app__element[data-position="current"]');
question.style.display = 'block';

let questionNumber = 0;

let check = document.querySelector('.btn-block__check');

document.querySelector('.question-number__current').innerHTML = questionNumber + 1;

// сделаем обработчик нажатия на checkbox

let el = document.querySelectorAll('.variants-block');

function checkbox(event) {

    let target = event.target;

    let check = document.querySelector('.btn-block__check');

    let inputs = document.querySelectorAll('.variants-block__checkbox');

    check.disabled = false;

    check.className = 'btn-block__check';

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

function checkQuestion(event) {
    let inputs = document.querySelectorAll('.variants-block__checkbox'),
        nextBtn = document.querySelector('.btn-block__next'),
        block = document.querySelector('.variants-block');

    for (let i = 0; i < inputs.length; i++) {

        let variant = inputs[i].parentNode.dataset.true;

        if (inputs[i].checked && variant == 'yes') {

            inputs[i].parentNode.style.backgroundColor = '#3CA84B';
            inputs[i].parentNode.lastElementChild.style.color = '#fff';

            block.style.pointerEvents = 'none';

            nextBtn.style.display = 'flex';
            check.style.display = 'none';
        } else {

            let trueVariant = document.querySelector('.variants-block__variant[data-true="yes"]');

            block.style.pointerEvents = 'none';

            if (inputs[i].checked) {
                inputs[i].parentNode.style.backgroundColor = '#D43140';
                inputs[i].parentNode.lastElementChild.style.color = '#fff';
                trueVariant.style.backgroundColor = '#3CA84B';
                trueVariant.lastElementChild.style.color = '#fff';

                nextBtn.style.display = 'flex';
                check.style.display = 'none';
            }
        }

    }

    check.className = 'btn-block__check disabled';

    if (questionNumber + 1 === questionArr.length) {
        nextBtn.firstChild.innerText = 'Закончить тест';
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

    check.style.display = 'flex';


    check.disabled = true;
    nextBtn.style.display = 'none';

    questionNumber++;
    if (questionNumber !== questionArr.length) {
        document.querySelector('.question-number__current').innerHTML = questionNumber + 1;
    }


    if (questionNumber == questionArr.length) {
        document.querySelector('.btn-block__result').style.display = 'flex';
        check.style.display = 'none';
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

        let questionIconRight = document.createElement('i');
        questionIconRight.className = 'result-block__icon-right fa fa-check';

        let questionIconWrong = document.createElement('i');
        questionIconWrong.className = 'result-block__icon-wrong fa fa-times';

        let questionAnswerRight = document.createElement('div');
        questionAnswerRight.className = 'result-block__list-item result-block__question-answer_right';
        questionAnswerRight.innerHTML = questionSelectArr[item].right;

        let questionAnswerWrong = document.createElement('div');
        questionAnswerWrong.className = 'result-block__list-item result-block__question-answer_wrong';
        questionAnswerWrong.innerHTML = questionSelectArr[item].wrong;

        let resultCont = document.createElement('div');
        resultCont.className = 'result-block__question';
        resultCont.append(questionTitle);

        if (questionSelectArr[item].wrong !== undefined) {
            // resultCont.append(questionIconWrong);
            resultCont.append(questionAnswerWrong);
            questionWrongCount++;
        } else {
            // resultCont.append(questionIconRight);
        }

        resultCont.append(questionAnswerRight);

        resultBlock.append(resultCont);

        resultBtn.style.display = 'none';

        againBtn.style.display = 'flex';
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

    document.querySelector('.result-block').style.display = 'flex';

}

resultBtn.addEventListener('click', showResult);

againBtn.addEventListener('click', function(){
    window.location.reload();
});

document.querySelector('.question-number__all').innerHTML = questionArr.length;



