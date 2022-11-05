// Variaveis utilizadas na Tela 2
const questionsAnswered = [];
let numberOfQuestionsInQuizz;
let selectedQuizz;
let resultsLevel;
let correctAnswers = [];

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

// getSelectedQuizz(3000);

/* Função utilizada para montar o quizz específico pego da API */
function assembleSelectedQuizzPage(quizz) {

    selectedQuizz = quizz;

    changeQuizzHeader(); // Monta o cabeçalho do quizz
    changeQuizzQuestions(); // Monta todas as perguntas do quizz
}

function changeQuizzHeader() {
    const quizzHeader = document.querySelector('.quizzHeader');

    quizzHeader.querySelector('img').src = selectedQuizz.image;
    quizzHeader.querySelector('h1').innerHTML = selectedQuizz.title;
}

function changeQuizzQuestions() {

    numberOfQuestionsInQuizz = selectedQuizz.questions.length;

    const quizzQuestions = document.querySelector('.quizzQuestions');

    for(let question in selectedQuizz.questions) {   

        let quizzAnswers = selectedQuizz.questions[question].answers;

        sortQuizzAnswers(quizzAnswers);
        
        quizzQuestions.innerHTML += `
            <section class="quizzQuestion">
                <div class="quizzQuestionHeader">
                    <p>
                        ${selectedQuizz.questions[question].title}
                    </p>
                </div>
                <div class="quizzOptions">
                    ${constructQuizzAnswers(quizzAnswers)}
                </div>
            </section>        
                `;
    }

    buildRightAnswersArray();
    addSelectionLogicToQuestions();
    toggleLoader(); 
    toggleScreen2();
    changeQuestionsHeadersColors();
}

/* Embaralha as repostas dos Quizzes */
function sortQuizzAnswers(quizzAnswers) {
    
    let tempQuizzAnswers = quizzAnswers.slice()
    const originalIndexes = [];

    /*Cria um array que vai de 1 até a quantidade de respostas */
    for(let answerIndex in quizzAnswers) {
        originalIndexes.push(answerIndex)
    }
    
    /*Cria um array embaralho a partir do array anterior */
    const sortedIndexes = originalIndexes.sort((a,b) => {
        return Math.random() - 0.5
    })

    /*Modifica o array original embaralhando-o*/
    for(let answerIndex in quizzAnswers) {
        quizzAnswers[answerIndex] = tempQuizzAnswers[sortedIndexes[answerIndex]]
    }    
}

function constructQuizzAnswers(quizzAnswers) {

    let quizzQuestionOptionsHTML = '';

    for(let i = 0; i < quizzAnswers.length; i++) {

        if(quizzAnswers[i].isCorrectAnswer) {
            quizzQuestionOptionsHTML += `<div class="quizzQuestionOption isCorrectAnswer">
                                                <figure>
                                                    <img src="${quizzAnswers[i].image}">
                                                    <div class="quizzQuestionOptionBackground hideElement"></div>
                                                </figure>
                                                <p>${quizzAnswers[i].text}</p>
                                        </div>`;    
        } else {
            quizzQuestionOptionsHTML += `<div class="quizzQuestionOption">
                                                <figure>
                                                    <img src="${quizzAnswers[i].image}">
                                                    <div class="quizzQuestionOptionBackground hideElement"></div>
                                                </figure>
                                                <p>${quizzAnswers[i].text}</p>
                                        </div>`;
        }
    }

    return quizzQuestionOptionsHTML;
}

function buildRightAnswersArray() {
    document.querySelectorAll('.quizzQuestionOption').forEach((option) => {
        if(option.classList.contains('isCorrectAnswer')) {
            correctAnswers.push(option);
        }
    })
}

/* Função utilizada para aplicar a lógica de seleção a todas as perguntas do quizz */
function addSelectionLogicToQuestions() {

    // Percorre todos os elementos da página com a classe de opção de resposta
    document.querySelectorAll('.quizzQuestionOption').forEach((question) => {
    
        // Adiciona um event listener em todas as opçoes de resposta
        question.addEventListener('click', () => {

            const currentQuestionDiv = question.parentNode;

            /* Verifica se a pergunta da resposta selecionada já
            foi respondida, neste caso é dado um return de forma
            a não permitir alterações na resposta */
            if(questionsAnswered.includes(currentQuestionDiv)) {
                return;
            }

            // array contendo todas as divs das opções de resposta da pergunta selecionada
            const listOfQuestions = Array.from(currentQuestionDiv.querySelectorAll('.quizzQuestionOption'));

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
            // Adiciona a pergunta ao array de perguntas respondidas
            questionsAnswered.push(currentQuestionDiv);

            changeAnswersTextColor(currentQuestionDiv);

            if(checkGameOver()) {
                changeQuizzResults(); // Monta os resultados do quizz
            }
        })
    });    
}

function changeQuizzResults() {

    const quizzResults = document.querySelector('.quizzResults');
    const quizzResultsHTML = []; 
    const levelsMinValue = [];

    const userScore = getUserQuizzScore();


    /*Cria todas as variações de div de resultado possíveis */
    selectedQuizz.levels.forEach((level, index) => {

        quizzResultsHTML[index] = `
            <div class="quizzResultsHeader">
                <p>${userScore}% de acerto: ${level.title}</p>
            </div>
            <div class="quizzResultsMain">
                <img src="${level.image}">
                <p>${level.text}</p>
            </div>
        `;

        // Cria um array contendo as porcentagens minimas de acerto
        levelsMinValue.push(level.minValue);
    });

    /* Verifica qual a porcentagem minima dos níveis o usuario 
       conseguiu acertar, isso será utilizado na montagem da div 
       de resultados, alterando a imagem e os textos*/
    for(let i = levelsMinValue.length-1; i >= 0; i--) {
        if(userScore >= levelsMinValue[i]) {
            resultsLevel = levelsMinValue[i];
            break;
        }
    }

    // Adiciona o template correto de div de resultado dependendo do número de acertos do usuario
    quizzResults.innerHTML = quizzResultsHTML[levelsMinValue.indexOf(resultsLevel)];
    quizzResults.classList.remove('hideElement')
}

// Cálcula a quantidade de acertos do usario, retorna este valor em porcentagem
function getUserQuizzScore() {

    let numberOfHits = 0

    document.querySelectorAll('.quizzQuestionOption').forEach(option => {
        if(option.classList.contains('isCorrectAnswer')) {

            const optionSelectedIsCorrect = option.querySelector('p').style.color === 'rgb(0, 156, 34)' &&
                                            option.querySelector('.quizzQuestionOptionBackground').classList.contains('hideElement')

            if(optionSelectedIsCorrect) {
                numberOfHits++;
            }
        }
    })

    return (numberOfHits/(correctAnswers.length))*100
}

function changeQuestionsHeadersColors() {
    const colors = ['#434CA0', '#A0438D', "#2d702e"];
    let colorCounter = 0;
    const questionsHeaders =  Array.from(document.querySelectorAll('.quizzQuestionHeader'));
    
    function resetColorCounter() {
        if(colorCounter === colors.length) {
            colorCounter = 0;
        }
    }

    questionsHeaders.forEach((header) => {
        header.style.backgroundColor = colors[colorCounter];
        colorCounter++;
        resetColorCounter();
    })
}

function changeAnswersTextColor(questionDiv) {
    
    const answersArray = Array.from(questionDiv.querySelectorAll('.quizzQuestionOption'));

    answersArray.forEach((answer) => {
        
        if(correctAnswers.includes(answer)) {
            changeAnswerTextToGreen(answer);
        } else {
            changeAnswerTextToRed(answer);
        }
    });
}

function changeAnswerTextToGreen(answer) {
    answer.querySelector('p').style.color = '#009C22';
}

function changeAnswerTextToRed(answer) {
    answer.querySelector('p').style.color = '#FF4B4B';
}

function checkGameOver() {
    if(questionsAnswered.length === numberOfQuestionsInQuizz ) {
        return true;
    }
    return false;
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
    quizzImage = document.querySelector(".quizzImage").value;
    if(quizzTitle.length<20 || quizzTitle.length>65 || !validateUrl(quizzImage,null,null,null) || quizzNumberQuestions<3 || quizzNumberLevels<2){
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
            <input type="text" class="incorrectAnswerQuestion1${i}"placeholder="Resposta incorreta 1">
            <input type="url" class="imageIncorrectAnswerQuestion1${i}" placeholder="URL da imagem 1">
            <br>                
            <input type="text" class="incorrectAnswerQuestion2${i}" placeholder="Resposta incorreta 2">
            <input type="url" class="imageIncorrectAnswerQuestion2${i}" placeholder="URL da imagem 2">
            <br>                
            <input type="text" class="incorrectAnswerQuestion3${i}" placeholder="Resposta incorreta 3">
            <input type="url" class="imageIncorrectAnswerQuestion3${i}" placeholder="URL da imagem 3">
        </form>
    </div>`
    }
    containerQuestionFields.innerHTML+= `
    <div class="question02">
        <h1 class="subtitleForm">Pergunta 2</h1>
        <ion-icon name="create-outline"></ion-icon>
    </div>
    <div class="question03">
        <h1 class="subtitleForm">Pergunta 3</h1>
        <ion-icon name="create-outline"></ion-icon>
    </div>
    <button class="buttonForm" onclick="saveQuestions()">Prosseguir pra criar níveis</button>
</section>`
}

function saveQuestions(){
    let image="2";
    const quizz = [];
    console.log(quizzNumberQuestions);
    for(let i=1; i<=quizzNumberQuestions; i++){
        let question= {id:"",text:"", correctAnswer:"", colorBackground:"", imageCorrectAnswer:"",incorrectAnswer1:"",imageIncorrectAnswer1:"",
        incorrectAnswer2:"",imageIncorrectAnswer2:"",incorrectAnswer3:"",imageIncorrectAnswer3:"",}
        question.id=i;
        question.text= document.querySelector(`.textQuestion${i}`).value;
        question.colorBackground= document.querySelector(`.backgroundQuestion${i}`).value;
        question.correctAnswer= document.querySelector(`.correctAnswerQuestion${i}`).value;
        question.incorrectAnswer1= document.querySelector(`.incorrectAnswerQuestion1${i}`).value;
        question.incorrectAnswer2= document.querySelector(`.incorrectAnswerQuestion2${i}`).value;
        question.incorrectAnswer3= document.querySelector(`.incorrectAnswerQuestion3${i}`).value;
        question.imageCorrectAnswer= document.querySelector(`.imageCorrectAnswerQuestion${i}`).value;
        question.imageIncorrectAnswer1= document.querySelector(`.imageIncorrectAnswerQuestion1${i}`).value;
        question.imageIncorrectAnswer2= document.querySelector(`.imageIncorrectAnswerQuestion2${i}`).value;
        question.imageIncorrectAnswer3= document.querySelector(`.imageIncorrectAnswerQuestion3${i}`).value;

        if((!validateUrl(question.imageCorrectAnswer, question.imageIncorrectAnswer1, question.imageIncorrectAnswer2, 
        question.imageIncorrectAnswer3) || question.text<20 || question.correctAnswer=="" || (!validateColor(question.colorBackground)) ||
        (question.incorrectAnswer1=="" && question.incorrectAnswer2=="" && question.incorrectAnswer3=="")))
        {
            alert("algo errado");
            break;
        }
        else{
            quizz.push(question);
        }
    }
    console.log(quizz);
}

function saveLevels(){

}

function accessQuizz(){

}

function home(){

}


function validateColor(code){
    const RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    if(RegExp.test(code)==true)
        return true;
    else
        return false;
}

function validateUrl(str1,str2,str3,str4){
    if(str3){
        try{
            new URL (str1);
            new URL (str2);
            new URL (str3);
            new URL (str4);
            return true;
        }catch(err){
            return false;
        }
    }else{
        try{
            new URL (str1);
            return true;
        }catch(err){
            return false;
        }
    }
}