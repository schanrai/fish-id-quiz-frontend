const BACKEND_URL = 'http://localhost:3000';
const FISH_URL = 'http://localhost:3000/api/v1/fish';

const mainPrompt = document.querySelector('#prompt')
const startContBtn = document.querySelector('#start-continue')
const subPrompt = document.querySelector('#subprompt')
const image = document.querySelector('img')
const questionCounter = document.querySelector('#question-count')
const radioButtons = document.querySelector('#radio-buttons')


document.addEventListener('DOMContentLoaded', () => {
  initGame()
});

 function initGame(){
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
      let questionSet = new Questions(fishDataJSON)
    //look into catch - the questions must be instanciated before gameInitRender can be triggered
    this.gameInitRender()})
 }

   gameInitRender(){
    mainPrompt.innerText = "What fish is this?"
    subPrompt.classList.add('hide')
    startContBtn.classList.add('hide')
    radioButtons.classList.remove('hide')
    //image.src = "https://myfwc.com/media/13792/bigeyescad.jpg"
  }
}

//gameListeners() for every user interaction, with if statements?


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
        console.log(choices)
        this.shuffleQuestions(choices)
      }
    }


    shuffleQuestions(array) {
      let newArray = [...array]
      for (let i = newArray.length - 1; i > 0; i--) {
        debugger
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      console.log(newArray)
      this.currentQuestion.push(newArray)
      console.log(this.currentQuestion)
    }

    //Plays next turn
    newTurn(){

    }


}
