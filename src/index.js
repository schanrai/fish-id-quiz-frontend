const BACKEND_URL = 'http://localhost:3000';
const FISH_URL = 'http://localhost:3000/api/v1/fish';
const numTurns = 20

const mainPrompt = document.querySelector('#prompt')
const startContBtn = document.querySelector('#start-continue')
const subPrompt = document.querySelector('#subprompt')
const form = document.querySelector('#form')
const submitBtn = document.querySelector("#submit-answer")

let questions;
let newGame;

//VIEWS + USER
document.addEventListener('DOMContentLoaded', () => {
  startGame()
})

function startGame(){
 startContBtn.innerText = "Start Game"
 startContBtn.setAttribute('name','start')
 startContBtn.addEventListener('click', () => {
    newGame = new Game()
  })
}

function continueGame(){
    startContBtn.addEventListener('click', () => {
    questions.selectChoicesForTurn ??
    newGame.newTurn(questions)
  })
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  let radioVal = getRadioVal(form, 'choices')
  newGame.checkAnswer(radioVal)
})

function getRadioVal(form, name) {
    let val;
// REFACTOR
    // get list of radio buttons with specified name
    const radios = form.elements[name];
    // loop through list of radio buttons
    for (var i=0; i < radios.length; i++) {
        if (radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value (fish id) in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}


// GAME CLASS - should I declare all the DOM elements here since Game main class interacting with them? How can I add them so they are available to every function?
class Game {

 constructor() {
   this.score = 0
   this.questionCounter = 0
   this.gameFetch()

  }

 scorePercent(score){
   let percentage = (score/this.questionCounter) * 100
   return Math.round(percentage)
 }


// Initial Fetch from Fish Table
  gameFetch(){
   fetch(FISH_URL, { method: 'GET' })
    .then(resp => resp.json())
    .then(fishDataJSON => {
      questions = new Questions(fishDataJSON)
    //look into catch - the questions must be instanciated before gameInitRender can be triggered
    this.gameInit(questions)})
  }

  gameInit(questions){
    console.log(this, questions)
    form.classList.remove('hide')
    this.newTurn(questions)
  }

  newTurn(questions){
    if (startContBtn.name == "continue"){
      submitBtn.classList.remove('hide')
    }
    subPrompt.classList.add('hide')
    startContBtn.classList.add('hide')
    const counter = document.querySelector('#question-count')
    const image = document.querySelector('img')
    let choiceOne = document.querySelector('#choiceOne')
    let choiceTwo = document.querySelector('#choiceTwo')
    let choiceThree = document.querySelector('#choiceThree')
    let choiceFour = document.querySelector('#choiceFour')
// REFACTOR
    choiceOne.checked = false
    choiceOne.value = questions.currentQuestion[0][0].id
    choiceOne.labels[0].innerText = questions.currentQuestion[0][0].name
    choiceTwo.checked = false
    choiceTwo.value = questions.currentQuestion[0][1].id
    choiceTwo.labels[0].innerText = questions.currentQuestion[0][1].name
    choiceThree.checked = false
    choiceThree.value = questions.currentQuestion[0][2].id
    choiceThree.labels[0].innerText = questions.currentQuestion[0][2].name
    choiceFour.checked = false
    choiceFour.value = questions.currentQuestion[0][3].id
    choiceFour.labels[0].innerText = questions.currentQuestion[0][3].name
    ++this.questionCounter
    console.log(this)
    counter.firstElementChild.innerText = this.questionCounter
    mainPrompt.innerText = "What fish is this?"
    image.src = `${questions.correctChoice.image_url}`
    //can you use array destrucring and iteration to assign these?


  }

  checkAnswer(radioVal){
    if (radioVal == questions.correctChoice.id){
      //correct
      newGame.score++
      let scorePercentage = newGame.scorePercent(this.score)
      mainPrompt.innerHTML = `<i class="far fa-check-circle"></i> Well done! You are correct`
      const percentCount = document.querySelector("#percent-count")
      percentCount.firstElementChild.innerText = scorePercentage
      this.answerView()
    } else {
      //incorrect
      mainPrompt.innerHTML = `<i class="far fa-check-circle"></i> Wrong! The correct answer is ${questions.correctChoice.name}.`
      this.answerView()
    }
  }


  answerView(){
    //Same code as incorrectView
    submitBtn.classList.add('hide')
    subPrompt.classList.remove('hide')
    subPrompt.innerHTML =`Learn more about this fish <a href="${questions.correctChoice.details_url}" target="_blank">here.</a>`
    startContBtn.classList.remove('hide')
    startContBtn.innerText = "Continue Game"
    startContBtn.setAttribute('name','continue')
    continueGame()
  }


//data attributes on start/continue button for start and continue
//gameListeners() for every user interaction, with if statements?
//checkAnswer => logic to check answer against currentQuestion, then provide feedback to user, update score and questionCounter, provide Continue button (diff id value). Also, think about doing a while loop for event listeners.

}


// QUESTIONS CLASS
class Questions {


  constructor(fishDataJSON) {
    this.fish = [...fishDataJSON];
    this.correctChoice = {}
    this.currentQuestion = []
    this.questionSet = []
    this.getRandomQuestionsFromArray(numTurns)
    }

    //Return 20 random fish objects from fish property array
    getRandomQuestionsFromArray(numItems) {
      while (this.questionSet.length < numItems) {
        const index = Math.floor(Math.random() * this.fish.length);
        const element = this.fish.slice(index)[0]; //note that this is non-destructive, leaves the fish array at 134
        if (this.questionSet.includes(element)){ // looks to see if questionSet array already has same fish element
          continue //this will skip forward and go back into the loop
        } else {
          this.questionSet.push(element)
        }
      }
      this.selectChoicesForTurn(this.fish, this.questionSet)
    }

    //Select 4 choices of possible answers for the currentQuestion and identify the correctChoice
    selectChoicesForTurn(fish, questions) {
      //shift should remove element from the questionSet array 
      this.correctChoice = questions.shift()
      let choices = []
      choices.push(this.correctChoice);
      let idx = fish.findIndex(x => x.name === this.correctChoice.name);
      const removed = fish.splice(idx,1); //removes it out of main fish array(property of questions) so that it won't be selected as one of the choices
      let results = fish.filter(x =>  x.category === this.correctChoice.category) // finds all the same-category fish  from fish array
      let count = 3 - results.length
      if (count > 0) {
       let noneFish = fish.filter(x =>  x.category === "None") //if less than 3 from same category, then supplement with fish from None category
        for (let i = 0; i < count; i++){
          choices.push(noneFish[i])
        }
       choices = [...choices, ...results]; //combine noneFish and samefish category
      } else {
        choices.push(results[0], results[1], results[2]) //push in first 3 results of same category find to populate questions
        this.shuffleQuestions(choices)
      }
    }

    //Shuffle elements in the choices array so correctChoice in different positions
    shuffleQuestions(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      this.currentQuestion.push(array)
    }



}
