// Variaveis utilizadas na Tela 2
let questionsAnswered = []; 
let correctAnswers = [];
let numberOfQuestionsInQuizz; 
let selectedQuizz; 
let resultsLevel;

// Variaveis utilizadas na Tela 3
const containerInformations = document.querySelector(".quizzInformation");
const containerQuestions = document.querySelector(".quizzQuestionsForm");
const containerLevels = document.querySelector(".quizzLevels");
const containerQuizzSucces = document.querySelector(".quizzSuccess");
let quizzTitle = ""; 
let quizzImage = ""; 
let idSuccess = "";
let quizzNumberQuestions = 0; 
let quizzNumberLevels = 0;
let completeQuizz = { title: "", image: "", questions: [], levels: [] };
let userQuizz = [];

// Inicio do programa
getQuizzes();

//********************************INICIO FUNÇÕES PARA EXIBIÇÃO DE TELAS********************************

/* Função para exibir e esconder a div do Loader */
function toggleLoader() {
  loader = document.querySelector('.screenLoader');

  if(loader.classList.contains('hidden')) {
    console.log('Exibindo Loader');
  } else {
    console.log('Escondendo Loader');
  }
  loader.classList.toggle('hidden');
}

/* Função para exibir e esconder o header dos meus quizes*/
function toggleMyQuizzesHeader() {
  quizzesHeader = document.querySelector('.myQuizzesHeader');

  if(quizzesHeader.classList.contains('hidden')) {
    console.log('Exibindo quizzesHeader');
  } else {
    console.log('Escondendo quizzesHeader');
  }
  quizzesHeader.classList.toggle('hidden');
}


function toggleScreen1() {

  screen1 = document.querySelector('.myQuizz');

  if(screen1.classList.contains('hidden')) {
    console.log('Exibindo Screen1');
  } else {
    console.log('Escondendo Screen1');
  }
  document.querySelector('.myQuizz').classList.toggle('hidden');
  document.querySelector('.allQuizzes').classList.toggle('hidden');
}

/* Função para exibir e esconder a div da Tela 2 */
function toggleScreen2() {

  screen2 = document.querySelector('.screen2');

  if(screen2.classList.contains('hidden')) {
    console.log('Exibindo Screen2');
  } else {
    console.log('Escondendo Screen2');
  }  
  screen2.classList.toggle('hidden');
}

/* Função para exibir e esconder a div da Tela 2 */
function toggleScreen3() {
  screen3 = document.querySelector('.quizzInformation');

  if(screen3.classList.contains('hidden')) {
    console.log('Exibindo Screen3');
  } else {
    console.log('Escondendo Screen3');
  }
  screen3.classList.toggle('hidden');
}

//********************************FIM FUNÇÕES PARA EXIBIÇÃO DE TELAS********************************


//********************************INICIO TELA 1********************************

/*Adiciona a lógica de click ao botão create quizz, saindo da tela 1 e indo para a 3*/
document.querySelector('.createQuizz').addEventListener('click', () => {
  toggleScreen1();
  toggleLoader();
  setTimeout(() => {
    toggleLoader();
    toggleScreen3();
  },500);
})

/*Adiciona a lógica de click ao botão create quizz, saindo da tela 1 e indo para a 3*/
document.querySelector('.myQuizzesHeader ion-icon').addEventListener('click', () => {
  toggleScreen1();
  toggleLoader();
  setTimeout(() => {
    toggleLoader();
    toggleScreen3();
  },500);
})

/* Função utilizada para pegar todos os quizzes da API */
function getQuizzes() {
    toggleScreen1(); toggleLoader();
    axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
        .then((response) => {
            renderAllQuizzes(response);
            renderMyQuizzes();
        })
        .catch((error) => {
            console.log(error);
    });
}

// Função que adiciona todos os quizzes ao site + numberID quando clicado //
function renderAllQuizzes(response) {
    const allQuizzescontainer = document.querySelector(".allQuizzesBox");
    allQuizzescontainer.innerHTML = '';

    for(let i in response.data) {
        const qbox = document.createElement("div");

        qbox.setAttribute('id', `${response.data[i].id}`);
        qbox.classList.add("qbox");

        qbox.innerHTML += `
        <img src= ${response.data[i].image}>
        <p>${response.data[i].title}</p>
        `;
        
        allQuizzescontainer.appendChild(qbox);
    }

  addLogicSelectionToAllQuizzes();
}

/*Adiciona a lógica de click a todos os quizzes adicionados a tela 1, permitindo ir a tela 2*/
function addLogicSelectionToMyQuizzes() {
    document.querySelectorAll('.myQuizzes .qbox').forEach((qbox) => {
        qbox.addEventListener('click', () => {
            toggleScreen1();
            getSelectedQuizz((qbox.id));
        });
    });    
}

/*Adiciona a lógica de click a todos os quizzes adicionados a tela 1, permitindo ir a tela 2*/
function addLogicSelectionToAllQuizzes() {
  document.querySelectorAll('.allQuizzes .qbox').forEach((qbox) => {
      qbox.addEventListener('click', () => {
          toggleScreen1();
          getSelectedQuizz((qbox.id));
      });
  });    
}

/* Função utilizada para pegar um quizz específico da API */
function getSelectedQuizz(quizzId) {
    
    toggleLoader();

    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`)
        .then((response) => {
            assembleSelectedQuizzPage(response.data);
        })
        .catch((error) => {
            console.log(error);
    })
}  

function renderMyQuizzes() {
  const emptyText = document.querySelector(".grayText");
  const createQuizzButton = document.querySelector('.createQuizz');
  const myQuizzesHeader = document.querySelector(".myQuizzesHeader");
  const myQuizzesSection = document.querySelector(".myQuizzes");
  const myQuizzesIdsArray = extractIdsArray();
  let isLastId = false;

  if(myQuizzesIdsArray === null || myQuizzesIdsArray === undefined) {
    toggleLoader(); 
    toggleScreen1();  
    return;
  }

  myQuizzesSection.innerHTML = '';

  // Ajusta a tela de meus quizzes
  emptyText.classList.add('hidden');
  myQuizzesHeader.classList.remove('hidden'); 
  createQuizzButton.classList.add('hidden')
  

  for(let i in myQuizzesIdsArray) {

    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${myQuizzesIdsArray[i]}`)
      .then((response) => {
        const qbox = document.createElement("div");

        qbox.setAttribute('id', `${response.data.id}`);
        qbox.classList.add("qbox");
    
        qbox.innerHTML += `
        <img src= ${response.data.image}>
        <p>${response.data.title}</p>
        `;
        
        myQuizzesSection.appendChild(qbox);  

        if(i == myQuizzesIdsArray.length - 1) {
          setTimeout(() => {
            toggleLoader();
            addLogicSelectionToMyQuizzes();
            toggleScreen1();
          },500)
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }
}

function extractIdsArray() {

  const idsArray = localStorage.getItem('ids');

  // caso usuario nao tenha nenhum quizz a função dá um return, evitando erros
  if(idsArray === null || idsArray === undefined) {
    return idsArray;
  }

  let id_solo = [];
  let ids = [];
  let i = 0;

  while(idsArray[i] !== undefined) {
    i++; 
  }
  i--;

  while(idsArray[i] !== undefined) {
    id_solo.push(idsArray[i]);
    i--;
    if(idsArray[i] === ',' || idsArray[i] === undefined) {
      ids.push(id_solo.toString().replaceAll(",",""));
      id_solo = [];
    }
  }

  ids.forEach((id,index) => {
    const invertedId = id;

    id = (Array.from(invertedId)).reverse().toString().replaceAll(",","")
    ids[index] = id;

  })

  return ids;
}

//********************************FIM TELA 1********************************



//********************************INICIO TELA 2********************************

/*Adiciona funcionabilidade ao botão de restart quizz */
document.querySelector('.restartQuizz').addEventListener('click', () => {
    lightCleanQuizz();
    toggleScreen2();
    toggleLoader();
    restartQuizz();
});

/*Adiciona funcionabilidade ao botão de return home */
document.querySelector('.returnHome').addEventListener('click', () => {
    fullCleanQuizz();
    toggleScreen2();
    setTimeout(() => {
      toggleLoader();
      toggleScreen1();
    }, 1000);
});

// função utilizada previamente ao reinicar do quizz, o quizzHeader nao é limpo
function lightCleanQuizz() {
    const quizzQuestions = document.querySelector('.quizzQuestions');
    const quizzResults = document.querySelector('.quizzResults');
    
    quizzQuestions.innerHTML = ''; quizzResults.innerHTML = '';  
    quizzResults.classList.add('hidden');
}

// função utilizada quando queremos retornar para home, também limpa o quizzHeader
function fullCleanQuizz() {
    cleanScreen2Variables();
    lightCleanQuizz();
    cleanQuizzHeader();
    toggleLoader();
}

/* função de restart do quizz, limpa as variáveis usadas na 
   tela 2 e reconstroi todas as perguntas do quizz*/
function restartQuizz() {
    cleanScreen2Variables();
    setTimeout(() => {
        changeQuizzQuestions();
    }, 1000);
}

function cleanScreen2Variables() {
    // Limpa as variaveis utilizadas na ultima tentativa do quizz
    questionsAnswered = []; correctAnswers = [];
    numberOfQuestionsInQuizz = 0; resultsLevel = 0;
}

function cleanQuizzHeader() {
    const quizzHeader = document.querySelector('.quizzHeader');

    quizzHeader.querySelector('img').src = '#';
    quizzHeader.querySelector('h1').innerHTML = '';
}

function forgetSelectedQuizz() {
    cleanScreen2Variables();
    selectedQuizz = undefined;
}

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

        sortArray(quizzAnswers);
        
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

    setTimeout(() => {
        toggleLoader(); toggleScreen2();
    }, 500);

    buildRightAnswersArray();
    addSelectionLogicToQuestions();
    changeQuestionsHeadersColors();
}

/* Embaralha o array colocado como argumento */
function sortArray(arrayToSort) {
    
    let tempArray = arrayToSort.slice()
    const originalIndexes = [];

    /*Cria um array de índices*/
    for(let i in arrayToSort) {
        originalIndexes.push(i)
    }
    
    /*Cria um array de índices embaralhados a partir do array anterior */
    const sortedIndexes = originalIndexes.sort((a,b) => {
        return Math.random() - 0.5
    })

    /*Modifica o array original embaralhando-o*/
    for(let i in arrayToSort) {
        arrayToSort[i] = tempArray[sortedIndexes[i]]
    }    
}

function constructQuizzAnswers(quizzAnswers) {

    let quizzQuestionOptionsHTML = '';

    for(let i = 0; i < quizzAnswers.length; i++) {

        if(quizzAnswers[i].isCorrectAnswer) {
            quizzQuestionOptionsHTML += `<div class="quizzQuestionOption isCorrectAnswer">
                                                <figure>
                                                    <img src="${quizzAnswers[i].image}">
                                                    <div class="quizzQuestionOptionBackground hidden"></div>
                                                </figure>
                                                <p>${quizzAnswers[i].text}</p>
                                        </div>`;    
        } else {
            quizzQuestionOptionsHTML += `<div class="quizzQuestionOption">
                                                <figure>
                                                    <img src="${quizzAnswers[i].image}">
                                                    <div class="quizzQuestionOptionBackground hidden"></div>
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
            const quizzAnswersDiv = question.parentNode;
            /* Verifica se a pergunta da resposta selecionada já foi respondida, neste 
            caso é dado um return de forma a não permitir alterações na resposta */
            if(questionsAnswered.includes(quizzAnswersDiv)) {
                return;
            }
            // array contendo todas as divs das opções de resposta da pergunta selecionada
            const listOfQuestions = Array.from(quizzAnswersDiv.querySelectorAll('.quizzQuestionOption'));
            // For usado para percorre item a item da lista
            for(let questionIndex in listOfQuestions) {
                // Seleciona a div de fundo transparente do elemento atual
                const transpBack = listOfQuestions[questionIndex].childNodes[1].querySelector('.quizzQuestionOptionBackground');
                // Lógica de seleção da opção
                transpBack.classList.add('hidden');
                if(listOfQuestions[questionIndex] !== question) {
                    transpBack.classList.toggle('hidden');
                }
            }
            // Adiciona a pergunta ao array de perguntas respondidas
            questionsAnswered.push(quizzAnswersDiv);

            changeAnswersTextColor(quizzAnswersDiv);

            if(checkGameOver()) {
                changeQuizzResults(); // Monta os resultados do quizz
            } else {
                scrollToNextQuestion(quizzAnswersDiv);
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
    quizzResults.classList.remove('hidden');

    setTimeout(() => {
        quizzResults.scrollIntoView({behavior: "smooth", block: "center"});
    },1000);
}

// Cálcula a quantidade de acertos do usario, retorna este valor em porcentagem
function getUserQuizzScore() {

    let numberOfHits = 0

    document.querySelectorAll('.quizzQuestionOption').forEach(option => {
        if(option.classList.contains('isCorrectAnswer')) {

            const optionSelectedIsCorrect = option.querySelector('p').style.color === 'rgb(0, 156, 34)' &&
                                            option.querySelector('.quizzQuestionOptionBackground').classList.contains('hidden')

            if(optionSelectedIsCorrect) {
                numberOfHits++;
            }
        }
    })

    return ((numberOfHits/(correctAnswers.length))*100).toFixed(0)
}

function changeQuestionsHeadersColors() {
    const colors = ['#434CA0', '#A0438D', "#2D702E"];
    
    sortArray(colors);

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
    if(questionsAnswered.length === numberOfQuestionsInQuizz) {
        return true;
    }
    return false;
}

function scrollToNextQuestion(quizzAnswersDiv) {

    let nextQuestionToScroll;
    let pointerToScroll = false;

    const currentQuestionDiv = quizzAnswersDiv.parentNode

    const quizzQuestions = document.querySelectorAll('.quizzQuestion');

    for(let question in quizzQuestions) {
        if(pointerToScroll) {
            nextQuestionToScroll = quizzQuestions[question];
            break;
        }
        if(currentQuestionDiv == quizzQuestions[question]) {
            pointerToScroll = true;
        }
    }

    setTimeout(() => {
        nextQuestionToScroll.scrollIntoView({behavior: "smooth", block: "center"});
    },1000);
}
//********************************FIM TELA 2********************************


//********************************INICIO TELA 3********************************

/*Esta função realiza a validação da string digitada pelo usuário para um cor, para retornar true
é necessário que a string inserida seja iniciada com # e seguida por 16 digitos hexadecimais*/
function validateColor(code) {
  const RegExp = /(^#[0-9A-F]{6}$)/i;
  if (RegExp.test(code) == true) return true;
  else return false;
}

/*Esta função realiza a validação da string digitada pelo usuário para uma URL, para retornar true
é necessário que um novo objeto da classe URl seja instanciado com sucesso*/
function validateUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

/* Esta função resgata as informações básicas inseridas pelo usuário e realiza a validação delas,
caso tudo esteja correto, a função que insere os campos de perguntas é chamada, caso contrário,
um alerta informando que há um erro nas informações é emitido */
function saveInformations() {
  quizzTitle = document.querySelector(".quizzTitle").value;
  quizzNumberQuestions = document.querySelector(".quizzNumberQuestions").value;
  quizzNumberLevels = document.querySelector(".quizzNumberLevels").value;
  quizzImage = document.querySelector(".quizzImage").value;
  if (
    quizzTitle.length < 20 ||
    quizzTitle.length > 65 ||
    !validateUrl(quizzImage, null, null, null) ||
    quizzNumberQuestions < 3 ||
    quizzNumberLevels < 2
  ) {
    alert(
      "Há um problema nas informações digitadas, por favor, revise os parâmetros"
    );
  } else {
    completeQuizz.title = quizzTitle;
    completeQuizz.image = quizzImage;
    containerInformations.classList.add("hidden");
    insertQuestionFields();
  }
}

/*Esta função insere os campos onde são digitadas cada pergunta de um quizz, a quantidade de 
campos inseridos é aquela digitada pelo usuário na tela de informações básicas do quizz*/
function insertQuestionFields() {
  containerQuestions.classList.remove("hidden");
  for (let i = 1; i <= quizzNumberQuestions; i++) {
    containerQuestions.innerHTML += `<div class="hidden qf forms question${i}">
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
        </div>
        <div class="dq question ${i}">
            <h1 class="subtitleForm">Pergunta ${i}</h1>
            <ion-icon name="create-outline" onclick="openQuestionField(this)"></ion-icon>
        </div>`;
  }
  containerQuestions.innerHTML += `
    <button class="buttonForm" onclick="saveQuestions()">Prosseguir pra criar níveis</button>
    `;
}

/*Esta função faz com que o formulário de uma pergunta seja aberto quando o usuário clica no 
icone de "editar" em uma das divs de pergunta*/
function openQuestionField(question) {
  let classes = [];
  const parent = question.parentNode;
  classes = parent.classList;
  let questionFields = document.querySelectorAll(".qf");
  let divsFields = document.querySelectorAll(".dq");
  for (let i = 0; i < questionFields.length; i++) {
    questionFields[i].classList.add("hidden");
  }
  for (let i = 0; i < divsFields.length; i++) {
    divsFields[i].classList.remove("hidden");
  }
  let questionForm = document.querySelector(`.question${classes[2]}`);
  parent.classList.add("hidden");
  questionForm.classList.remove("hidden");
}

/* Esta função resgata as informações das perguntas inseridas pelo usuário e realiza a validação delas,
caso tudo esteja correto, a função que insere os campos de níveis é chamada, caso contrário,
um alerta informando que há um erro nas informações é emitido */
function saveQuestions() {
  let cont = 0;
  for (let i = 1; i <= quizzNumberQuestions; i++) {
    let question = {
      title: "",
      color: "",
      answers: [
        (ans1 = { text: "", image: "", isCorrectAnswer: true }),
        (ans2 = { text: "", image: "", isCorrectAnswer: false }),
        (ans3 = { text: "", image: "", isCorrectAnswer: false }),
        (ans4 = { text: "", image: "", isCorrectAnswer: false }),
      ],
    };
    question.title = document.querySelector(`.textQuestion${i}`).value;
    question.color = document.querySelector(`.backgroundQuestion${i}`).value;
    ans1.text = document.querySelector(`.correctAnswerQuestion${i}`).value;
    ans2.text = document.querySelector(`.incorrectAnswerQuestion1${i}`).value;
    ans3.text = document.querySelector(`.incorrectAnswerQuestion2${i}`).value;
    ans4.text = document.querySelector(`.incorrectAnswerQuestion3${i}`).value;
    ans1.image = document.querySelector(
      `.imageCorrectAnswerQuestion${i}`
    ).value;
    ans2.image = document.querySelector(
      `.imageIncorrectAnswerQuestion1${i}`
    ).value;
    ans3.image = document.querySelector(
      `.imageIncorrectAnswerQuestion2${i}`
    ).value;
    ans4.image = document.querySelector(
      `.imageIncorrectAnswerQuestion3${i}`
    ).value;

    const url1 = validateUrl(ans1.image);
    const url2 = validateUrl(ans2.image);
    const url3 = validateUrl(ans3.image);
    const url4 = validateUrl(ans4.image);

    if (
      !url1 ||
      (!url2 && !url3 && !url4) ||
      question.title.length < 20 ||
      ans1.text.length < 20 ||
      !validateColor(question.color) ||
      (ans2.text == "" && ans3.text == "" && ans4.text == "")
    ) {
      alert(
        "Há um problema nas informações digitadas, por favor, revise os parâmetros"
      );
      cont--;
      return;
    } else {
      if (ans2.text == "" || !url2) question.answers[1] = null;
      if (ans3.text == "" || !url3) question.answers[2] = null;
      if (ans4.text == "" || !url4) question.answers[3] = null;
    }

    let index = question.answers.indexOf(null);
    while (index >= 0) {
      question.answers.splice(index, 1);
      index = question.answers.indexOf(null);
    }
    completeQuizz.questions.push(question);
    cont++;
  }

  if (cont == quizzNumberQuestions) {
    containerQuestions.classList.add("hidden");
    insertLevelsFields();
  } else
    alert(
      "Há um problema nas informações digitadas, por favor, revise os parâmetros"
    );
}

/*Esta função insere os campos onde são digitados cada nível de um quizz, a quantidade de 
campos inseridos é aquela digitada pelo usuário na tela de informações básicas do quizz*/
function insertLevelsFields() {
  containerLevels.classList.remove("hidden");
  for (let i = 1; i <= quizzNumberLevels; i++) {
    containerLevels.innerHTML += `<div class="hidden forms ql level${i}">
        <form action="formInformation">
            <h1 class="subtitleForm">Nível ${i}</h1>
            <input type="text" class="titleLevel${i}" placeholder="Título do nível">
            <input type="number" class="minHitsLevel${i}" placeholder="% de acerto mínima">
            <input type="url" class="imageLevel${i}" placeholder="URL da imagem do nível">
            <input type="text" class="descriptionLevel${i}" placeholder="Descrição do nível">
        </form>
    </div>
        <div class="dl level ${i}">
        <h1 class="subtitleForm">Nível ${i}</h1>
        <ion-icon name="create-outline" onclick="openLevelField(this)"></ion-icon>
    </div>`;
  }
  containerLevels.innerHTML += `
    <button class="buttonForm" onclick="saveLevels()">Finalizar Quizz</button>`;
}

/*Esta função faz com que o formulário de um nível seja aberto quando o usuário clica no 
icone de "editar" em uma das divs de nível*/
function openLevelField(level) {
  let classes = [];
  const parent = level.parentNode;
  classes = parent.classList;
  let levelFields = document.querySelectorAll(".ql");
  let divsLevelFields = document.querySelectorAll(".dl");
  for (let i = 0; i < levelFields.length; i++) {
    levelFields[i].classList.add("hidden");
  }
  for (let i = 0; i < divsLevelFields.length; i++) {
    divsLevelFields[i].classList.remove("hidden");
  }
  let levelForm = document.querySelector(`.level${classes[2]}`);
  parent.classList.add("hidden");
  levelForm.classList.remove("hidden");
}

/* Esta função resgata as informações dos níveis inseridas pelo usuário e realiza a validação delas,
caso tudo esteja correto, a função que realiza o envio do quizz para o servidor é chamada, caso contrário,
um alerta informando que há um erro nas informações é emitido */
function saveLevels() {
  const arrayLevels = [];
  for (let i = 1; i <= quizzNumberLevels; i++) {
    let level = { title: "", image: "", text: "", minValue: "" };
    level.title = document.querySelector(`.titleLevel${i}`).value;
    level.image = document.querySelector(`.imageLevel${i}`).value;
    level.text = document.querySelector(`.descriptionLevel${i}`).value;
    level.minValue = document.querySelector(`.minHitsLevel${i}`).value;

    const url = validateUrl(level.image);

    if (
      !url ||
      level.title.length < 10 ||
      level.text.length < 30 ||
      level.minValue < 0 ||
      level.minValue == "" ||
      !level.minValue ||
      level.minValue > 100
    ) {
      alert(
        "Há um problema nas informações digitadas, por favor, revise os parâmetros"
      );
      return;
    } else {
      arrayLevels.push(level);
    }
  }
  let minHit0 = 0;
  for (let i = 0; i < arrayLevels.length; i++) {
    if (arrayLevels[i].minValue == 0) minHit0++;
  }
  if (minHit0 > 0) {
    for (let i = 0; i < arrayLevels.length; i++)
      completeQuizz.levels.push(arrayLevels[i]);
  } else {
    alert(
      "Há um problema nas informações digitadas, por favor, revise os parâmetros"
    );
    return;
  }
  sendQuizz();
}

/*Esta funnção realiza o post do quizz por meio da API. Quando a operação for confirmada, a função que 
realiza o salvamente do id do quizz criado é chamada, enquanto isso, um loader fica na tela*/
function sendQuizz() {

  containerLevels.classList.add("hidden");
  toggleLoader();

  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
    completeQuizz
  )
  .then(() => {
    axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
        .then((response) => {
            let ids = localStorage.getItem('ids');
            ids = ids ? ids.split(',') : [];
            ids.push(response.data[0].id);
            localStorage.setItem('ids', ids.toString());
            successQuizz();
        })
        .catch((error) => {
            console.log(error);            
    })
  })
}

/*Esta função mostra a tela de sucesso do quizz, com a imagem do quiz que acabou de ser criado
e um botão para acessá-lo ou voltar para home*/
function successQuizz() {

  const id = extractIdsArray()[0].replaceAll(",","");

  axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`)
    .then((response) => {
      containerQuizzSucces.innerHTML += `
      <div class="finalQuizz">
          <img class="imgfinal" src="${response.data.image}">
          <div class="titlefinal">${response.data.title}</div>
      </div>
      <button class="buttonForm buttonFinal" onclick="accessQuizz(${id})">Acessar Quizz</button>
      <p class="returnh" onclick="returnHome()">Voltar pra home</p>
      `;

      toggleLoader();
      containerQuizzSucces.classList.remove("hidden");
    
    })
    .catch((error) => {
        console.log(error);
    });
}


/*Esta função faz com que o usuário seja redirecionado para a home*/
function returnHome() {
  toggleLoader();
  containerQuizzSucces.classList.add("hidden");
  renderMyQuizzes();
}

/*Esta função faz com que o quizz que acabou de ser criado seja acessado*/
function accessQuizz(myQuizzSentId) {
  containerQuizzSucces.classList.add("hidden");
  getSelectedQuizz(myQuizzSentId);
}

//********************************FIM TELA 3********************************
