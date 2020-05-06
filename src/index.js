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



class Game {
 constructor() {

   this.score = 0
   this.questionCounter = 1
   this.gameFetch()
   }

// INITIAL FETCH
  gameFetch(){
   fetch(FISH_URL, { method: 'GET' })
    .then(resp => resp.json())
    .then(fishDataJSON => console.log(fishDataJSON))
    this.gameInitRender()
 }

   gameInitRender(){
    mainPrompt.innerText = "What fish is this?"
    subPrompt.classList.add('hide')
    startContBtn.classList.add('hide')
    radioButtons.classList.remove('hide')
    //image.src = "https://myfwc.com/media/13792/bigeyescad.jpg"
    //instantiate the set of questions with the fishDataJSON
  }
}

//gameListeners() for every user interaction, with if statements?



//
// class Questions {
//
// }
