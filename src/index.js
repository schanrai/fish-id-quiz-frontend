const BACKEND_URL = 'http://localhost:3000';
const FISH_URL = 'http://localhost:3000/api/v1/fish';

const mainPrompt = document.querySelector('#prompt')
const startContBtn = document.querySelector('#start-continue')
const subPrompt = document.querySelector('#subprompt')
const image = document.querySelector('img')
const radioButtons = document.querySelector('#radio-buttons')
const counter = document.querySelector('#question-count')

document.addEventListener('DOMContentLoaded', () => {
  startGame()
});

 function startGame(){
   startContBtn.innerText = "Start Game"
   startContBtn.addEventListener('click', () => {
      let newGame = new Game()
    })
 }

// GAME CLASS
class Game {

 constructor() {
   this.score = 0
   this.questionCounter = 0
   this.gameFetch()
  }

// Initial Fetch from Fish Table
  gameFetch(){
   fetch(FISH_URL, { method: 'GET' })
    .then(resp => resp.json())
    .then(fishDataJSON => {
      let questions = new Questions(fishDataJSON)
    //look into catch - the questions must be instanciated before gameInitRender can be triggered
    this.gameInit(questions)})
  }

  gameInit(questions){
    console.log(this, questions)
    subPrompt.classList.add('hide')
    startContBtn.classList.add('hide')
    radioButtons.classList.remove('hide')
    this.newTurn(questions)
  }

  newTurn(questions){
    let choiceOne = document.querySelector('#choiceOne')
    let choiceTwo = document.querySelector('#choiceTwo')
    let choiceThree = document.querySelector('#choiceThree')
    let choiceFour = document.querySelector('#choiceFour')
    this.questionCounter++
    counter.firstElementChild.innerText = this.questionCounter
    mainPrompt.innerText = "What fish is this?"
    image.src = `${questions.correctChoice.image_url}`
    choiceOne.value = questions.currentQuestion[0][0].name
    choiceOne.labels[0].innerText = choiceOne.value
    choiceTwo.value = questions.currentQuestion[0][1].name
    choiceTwo.labels[0].innerText = choiceTwo.value
    choiceThree.value = questions.currentQuestion[0][2].name
    choiceThree.labels[0].innerText = choiceThree.value
    choiceFour.value = questions.currentQuestion[0][3].name
    choiceFour.labels[0].innerText = choiceFour.value
  }

//data attributes on start/continue button for start and continue
//gameListeners() for every user interaction, with if statements?
//play turn => takes values of submit and stores it, prevents anything else being pressed accepted
//setAnswer => logic to check answer against currentQuestion, then provide feedback to user, update score and questionCounter, provide Continue button (diff id value)


}




// QUESTIONS CLASS
class Questions {


  constructor(fishDataJSON) {
    this.fish = [...fishDataJSON];
    this.correctChoice = {}
    this.currentQuestion = []
    this.questionSet = []
    this.getRandomQuestionsFromArray(20)
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
