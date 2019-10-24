'use strict'

// пронумеруем вопросы

let questionArr = document.querySelectorAll('.container__element');

let question = document.querySelector('.container__element[data-position="current"]');
question.style.display = 'block';

// сделаем обработчик нажатия на checkbox

let el = document.querySelectorAll('.variants-block');

function checkbox(event) {

	let target = event.target;

	let check = document.querySelector('.btn-block__check');

	let inputs = document.querySelectorAll('.variant-block__checkbox');

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
	let inputs = document.querySelectorAll('.variant-block__checkbox'),
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

			let trueVariant = document.querySelector('.variant[data-true="yes"]');

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


check.addEventListener('click', checkQuestion);

// переключение вопроса

var nextBtn = document.querySelector('.btn-block__next');

function nextQuestion() {

	let mainBlock = document.querySelector('.container__element');

	let question = document.querySelector('.container__element[data-position="current"]');

	question.dataset.position = '';
	question.style.display = 'none';

	question.nextElementSibling.dataset.position = 'current';
	question.nextElementSibling.style.display = 'block';

	check.style.display = 'block';
	check.disabled = true;
	nextBtn.style.display = 'none';

	mainBlock.remove();
}

nextBtn.addEventListener('click', nextQuestion);

