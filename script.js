/* Função utilizada para pegar todos os quizzes da API */
function getQuizzes() {
    axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
        .then((response) => {
            // console.log(response.data);
        })
        .catch((error) => {
            // console.log(error);
        })
}

/* Função utilizada para pegar um quizz específico da API */
function getSelectedQuizz(quizzId) {
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`)
        .then((response) => {
            // console.log(response.data);
            assembleSelectedQuizzPage(response.data);
        })
        .catch((error) => {
            // console.log(error);
        })
}   

/* INICIO JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */

// getSelectedQuizz(15102); //used as an example

/* Função utilizada para montar o quizz específico pego da API */
function assembleSelectedQuizzPage(quizz) {
    
    const levelSelected = 0; //used as an example

    changeQuizzHeader(quizz);    
    changeQuizzAnswers(quizz, levelSelected);
    changeQuizzResults(quizz, levelSelected);      
}

function changeQuizzHeader(quizz) {
    const quizzHeader = document.querySelector('.quizzHeader');

    // changes the quizz header image and title 
    quizzHeader.querySelector('img').src = quizz.image;
    quizzHeader.querySelector('h1').innerHTML = quizz.title;
}

function changeQuizzAnswers(quizz, levelSelected) {
    let quizzAnswers = quizz.questions[levelSelected].answers;

    const quizzQuestions = document.querySelector('.quizzQuestions');
    
    quizzQuestions.innerHTML += `
        <section class="quizzQuestion">
            <div class="quizzQuestionHeader">
                <p>
                    ${quizz.questions[levelSelected].title}
                </p>
            </div>
            <div class="quizzOptions">
                ${constructQuizzAnswers(quizzAnswers)}
            </div>
        </section>        
            `;
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
}
/* FIM JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */