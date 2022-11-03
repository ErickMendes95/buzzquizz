/* Função utilizada para pegar todos os quizzes da API */
function getQuizzes() {
    axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
}

/* Função utilizada para pegar um quizz específico da API */
function getSelectedQuizz(quizzId) {
    
    toggleLoader();

    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`)
        .then((response) => {
            // console.log(response.data);
            assembleSelectedQuizzPage(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
}  

function toggleLoader() {
    document.querySelector('.screenLoader').classList.toggle('hideElement');
}

function toggleScreen2() {
    document.querySelector('.screen2').classList.toggle('hideElement');
}

/* INICIO JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */

/* Função utilizada para montar o quizz específico pego da API */
function assembleSelectedQuizzPage(quizz) {
    
    console.log(quizz);
    const levelSelected = 0; //used as an example

    changeQuizzHeader(quizz);    
    changeQuizzQuestions(quizz);
    changeQuizzResults(quizz, levelSelected);      
}

function changeQuizzHeader(quizz) {
    const quizzHeader = document.querySelector('.quizzHeader');

    // changes the quizz header image and title 
    quizzHeader.querySelector('img').src = quizz.image;
    quizzHeader.querySelector('h1').innerHTML = quizz.title;
}

function changeQuizzQuestions(quizz) {

    const quizzQuestions = document.querySelector('.quizzQuestions');

    for(let question in quizz.questions) {
        
        let quizzAnswers = quizz.questions[question].answers;
        
        quizzQuestions.innerHTML += `
            <section class="quizzQuestion">
                <div class="quizzQuestionHeader">
                    <p>
                        ${quizz.questions[question].title}
                    </p>
                </div>
                <div class="quizzOptions">
                    ${constructQuizzAnswers(quizzAnswers)}
                </div>
            </section>        
                `;
    }

    addSelectionLogicToQuestion();
}

function constructQuizzAnswers(quizzAnswers) {

    let quizzQuestionOptionsHTML = '';

    for(let i = 0; i < quizzAnswers.length; i++) {
        quizzQuestionOptionsHTML += `<div class="quizzQuestionOption">
                                            <figure>
                                                <img src="${quizzAnswers[i].image}">
                                                <div class="quizzQuestionOptionBackground hideElement"></div>
                                            </figure>
                                            <p>${quizzAnswers[i].text}</p>
                                    </div>`
    }
    return quizzQuestionOptionsHTML;
}

function addSelectionLogicToQuestion() {

    document.querySelectorAll('.quizzQuestionOption').forEach((question) => {
        question.addEventListener('click', () => {
            const listOfQuestions = Array.from(question.parentNode.querySelectorAll('.quizzQuestionOption'));
            
            for(let questionIndex in listOfQuestions) {
                const transpBack = listOfQuestions[questionIndex].childNodes[1].querySelector('.quizzQuestionOptionBackground');
                transpBack.classList.add('hideElement');
                if(listOfQuestions[questionIndex] !== question) {
                    transpBack.classList.toggle('hideElement');
                }
            }
        })
    });
}

function changeQuizzResults(quizz, levelSelected) {
    
    const quizzResults = document.querySelector('.quizzResults');
    const quizzResultsHTML = []; 
    const levelsMinValue = [];

    quizz.levels.forEach((level, index) => {

        quizzResultsHTML[index] = `
            <div class="quizzResultsHeader">
                <p>${level.title}</p>
            </div>
            <div class="quizzResultsMain">
                <img src="${level.image}">
                <p>${level.text}</p>
            </div>
        `;
        
        levelsMinValue.push(level.minValue);
    });

    quizzResults.innerHTML = quizzResultsHTML[levelSelected];
    toggleLoader(); toggleScreen2();
}
/* FIM JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */