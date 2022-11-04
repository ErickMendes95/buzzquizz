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

/* Função para exibir e esconder a div do Loader */
function toggleLoader() {
    document.querySelector('.screenLoader').classList.toggle('hideElement');
}

/* Função para exibir e esconder a div da Tela 2 */
function toggleScreen2() {
    document.querySelector('.screen2').classList.toggle('hideElement');
}

/* INICIO JAVASCRIPT DESENVOLVIDO PARA A TELA 2 - ÉRICO */

// getSelectedQuizz(15102);

/* Função utilizada para montar o quizz específico pego da API */
function assembleSelectedQuizzPage(quizz) {
    
    const levelSelected = 0; // level - 0 usado de exemplo

    changeQuizzHeader(quizz); // Monta o cabeçalho do quizz
    changeQuizzQuestions(quizz); // Monta todas as perguntas do quizz
    changeQuizzResults(quizz, levelSelected); // Monta os resultados do quizz
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

/* Função utilizada para aplicar a lógica de seleção a todas as perguntas do quizz */
function addSelectionLogicToQuestion() {

    // Percorre todos os elementos da página com a classe de opção de resposta
    document.querySelectorAll('.quizzQuestionOption').forEach((question) => {
        
        // Adiciona um event listener em todas as opçoes de resposta
        question.addEventListener('click', () => {

            // array contendo todas as divs das opções de resposta da pergunta selecionada
            const listOfQuestions = Array.from(question.parentNode.querySelectorAll('.quizzQuestionOption'));
            
            // For usado para percorre item a item da lista
            for(let questionIndex in listOfQuestions) {

                // Seleciona a div de fundo transparente do elemento atual
                const transpBack = listOfQuestions[questionIndex].childNodes[1].querySelector('.quizzQuestionOptionBackground');
                
                // Lógica de seleção da opção
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

/* JAVASCRIPT - CADASTRO DE QUIZZ - GPS*/
let quizzTitle = "";
let quizzImage = "";
let quizzNumberQuestions = 0;
let quizzNumberLevels = 0;

function saveInformations(){
    let containerInformations = document.querySelector('.quizzInformation')
    quizzTitle = document.querySelector(".quizzTitle").value;
    quizzNumberQuestions = document.querySelector(".quizzNumberQuestions").value;
    quizzNumberLevels = document.querySelector(".quizzNumberLevels").value;
    try{
        quizzImage = new URL (document.querySelector(".quizzImage").value);
    }catch(err){
        quizzImage=null;
    }

    if(quizzTitle.length<20 || quizzTitle.length>65 || !quizzImage || quizzNumberQuestions<3 || quizzNumberLevels<2){
        alert("Informações erradas")
    }
    else{
        console.log(containerInformations.classList)
        containerInformations.classList.add("hidden");
        insertQuestionFields();
    }
    
}

function insertQuestionFields(){
    let containerQuestionFields = document.querySelector(".quizzQuestionsForm");
    console.log(containerQuestionFields.classList)
    containerQuestionFields.classList.remove("hidden");
    for(let i=1; i<=quizzNumberQuestions; i++){
        containerQuestionFields.innerHTML += 
        `<div class="forms question${i}">
        <form action="formInformation">
            <h1 class="subtitleForm">Pergunta ${i}</h1>
            <input type="text" class="textQuestion${i}" placeholder="Texto da pergunta">
            <input type="text" class="backgroundQuestion${i}" placeholder="Cor de fundo da pergunta">
            <h1 class="subtitleForm">Resposta Correta</h1>
            <input type="text" class="correctAnswerQuestion${i}" placeholder="Resposta correta">
            <input type="url" class="imageCorrectAnswerQuestion${i}" placeholder="URL da imagem">
            <h1 class="subtitleForm">Respostas incorretas</h1>
            <input type="text" class="incorrectAnswerQuestion${i}"placeholder="Resposta incorreta 1">
            <input type="url" class="imageIncorrectAnswerQuestion${i}" placeholder="URL da imagem 1">
            <br>                
            <input type="text" class="incorrectAnswerQuestion${i}" placeholder="Resposta incorreta 2">
            <input type="url" class="imageIncorrectAnswerQuestion${i}" placeholder="URL da imagem 2">
            <br>                
            <input type="text" class="incorrectAnswerQuestion${i}" placeholder="Resposta incorreta 3">
            <input type="url" class="imageIncorrectAnswerQuestion${i}" placeholder="URL da imagem 3">
        </form>
    </div>`
    }
    containerQuestionFields.innerHTML+= `
    <div class="question2">
        <h1 class="subtitleForm">Pergunta 2</h1>
        <ion-icon name="create-outline"></ion-icon>
    </div>
    <div class="question3">
        <h1 class="subtitleForm">Pergunta 3</h1>
        <ion-icon name="create-outline"></ion-icon>
    </div>
    <button class="buttonForm" onclick="saveQuestions()">Prosseguir pra criar níveis</button>
</section>`
}

function saveQuestions(){

}

function saveLevels(){

}

function accessQuizz(){

}

function home(){

}