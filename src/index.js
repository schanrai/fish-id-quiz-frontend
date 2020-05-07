const BACKEND_URL = 'http://localhost:3000';
const FISH_URL = 'http://localhost:3000/api/v1/fish';

const mainPrompt = document.querySelector('#prompt')
const startContBtn = document.querySelector('#start-continue')
const subPrompt = document.querySelector('#subprompt')
const image = document.querySelector('img')
const questionCounter = document.querySelector('#question-count')
const radioButtons = document.querySelector('#radio-buttons')



document.addEventListener('DOMContentLoaded', () => {
// TRIGGER NEW GAME
    startContBtn.addEventListener('click', () => {
      let newGame = new Game()
    })
//DND-this ends the whole callback function for the DOMContentLoaded
});


// GAME CLASS
class Game {
 constructor() {
   this.score = 0
   this.questionCounter = 0
   this.gameFetch()
   }

// INITIAL FETCH
  gameFetch(){
   fetch(FISH_URL, { method: 'GET' })
    .then(resp => resp.json())
    .then(fishDataJSON => {
      let questionSet = new Questions(fishDataJSON)
      //console.log(fishDataJSON))
    //instantiate the set of questions with the fishDataJSON
    //the questions must be instanciated before gameInitRender can be triggered
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
    this.correctChoice = 0
    //this.fish = [...fishDataJSON];
    this.fishCopy = [...fishDataJSON];
    this.getRandomQuestionsFromArray(20)
    }

    //RETURN 20 RANDOM FISH FROM FISH ARRAY
    getRandomQuestionsFromArray(numItems) {
      const questions = [];
      while (questions.length < numItems) {
        const index = Math.floor(Math.random() * this.fishCopy.length);
        const element = this.fishCopy.slice(index)[0];
        if (questions.includes(element)){
          continue
        } else {
          questions.push(element)
        }
      }
      console.log(questions)
      //return questions;
      //this.selectChoicesForTurn(fish, questions)
    }

    selectChoicesForTurn(arr, questions) {
      correctChoice = questions.shift()
      console.log(correctChoice)
      let currentQuestion = [];
      currentQuestion.push(correctChoice);
      let idx = fish.findIndex(x => x.name === correctChoice.name);
      const removed = fish.splice(idx,1);
      let results = fish.filter(x =>  x.category === correctChoice.category)
      let count = 3 - results.length
      if (count > 0) {
       let noneFish = fish.filter(x =>  x.category === "None")
        for (let i = 0; i < count; i++){
          currentQuestion.push(noneFish[i])
        }
       currentQuestion = [...currentQuestion, ...results];
      } else {
        currentQuestion.push(results[0], results[1], results[2])
      }
      return currentQuestion
    }



}
