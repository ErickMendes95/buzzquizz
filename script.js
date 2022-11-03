/* INICIO JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */

getSelectedQuizz(15102); //used as an example

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

/* Função utilizada para montar o quizz específico pego da API */
function assembleSelectedQuizzPage(quizz) {

    const quizzHeader = document.querySelector('.quizzHeader');
    const quizzQuestions = document.querySelector('.quizzQuestions')
    
    const levelSelected = 0; // example

    let quizzQuestionOptionsHTML = '';

    for(let i = 0; i < quizz.questions[levelSelected].answers.length; i++) {
        quizzQuestionOptionsHTML += `<div class="quizzQuestionOption">
                                            <figure>
                                                <img src="${quizz.questions[levelSelected].answers[i].image}">
                                                <div class="quizzQuestionOptionBackground hideElement"></div>
                                            </figure>
                                            <p>${quizz.questions[levelSelected].answers[i].text}</p>
                                    </div>`
    }

    quizzQuestions.innerHTML += `
        <section class="quizzQuestion">
            <div class="quizzQuestionHeader">
                <p>
                    ${quizz.questions[levelSelected].title}
                </p>
            </div>
            <div class="quizzOptions">
                ${quizzQuestionOptionsHTML}
            </div>
        </section>        
    `;

    const quizzHeaderImg = quizzHeader.querySelector('img');
    const quizzHeaderTitle = quizzHeader.querySelector('h1');

    quizzHeaderImg.src = quizz.image;
    quizzHeaderTitle.innerHTML = quizz.title;

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