const BASE_URL = 'http://localhost:3000/api/v1';
const numTurns = 3

const mainPrompt = document.querySelector('#prompt')
const startBtn = document.querySelector('#start')
const contBtn = document.querySelector('#continue')
const subPrompt = document.querySelector('#subprompt')
const form = document.querySelector('#form')
const submitBtn = document.querySelector("#submit-answer")
const signupForm = document.querySelector("#signupModal")
const loginForm = document.querySelector("#loginModal")

let newGame;
let player;

//VIEWS + LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  contBtn.classList.add('hide')
  startGame()
})

function startGame(){
 startBtn.addEventListener('click', () => {
   updatePercentView("--")
    newGame = new Game()
  })
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  User.createNewUser()
})

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  User.loginUser()
})

function continueGame(){
    this.questions.selectChoicesForTurn(
      this.questions.fish, this.questions.questionSet)
}

contBtn.addEventListener('click', () => {
  newGame.newTurn()
})


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

function updatePercentView(scorePercentage){
  const percentCount = document.querySelector("#percent-count")
  percentCount.firstElementChild.innerText = scorePercentage
}

function showAlert(alertMsg){
  const alertText = document.querySelector('#alert-text')
  alertText.innerText = alertMsg
  const alertSect = document.querySelector('#alert-sect')
  alertSect.style = "display: block"
}

function showSuccess(alertMsg){
  const alertSect = document.querySelector('#alert-sect')
  alertSect.classList.remove('alert')
  alertSect.classList.add('success')
  const alertText = document.querySelector('#alert-text')
  alertText.innerText = alertMsg
  alertSect.style = "display: block"
}

function showLoggedInView(){

  // show success message argument to showSucess()
  // change the button text for Signup to profile
  // change the buttin text for Login to logout
  // add consitional logic to implement attribute on SignupModal, or changes the ID on which  triggers another Profile modal
}

//USER CLASS

class User {
  constructor(email, username, token) {
    this.email = email;
    this.username = username;
    this.token = token;
  }


  static createNewUser(){
    let usernameInput = document.querySelector('#username-signup')
    let emailInput = document.querySelector('#email-signup')
    let passwordInput = document.querySelector('#pass-signup')
    const configSignup = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'username': usernameInput.value,
            'email': emailInput.value,
            'password': passwordInput.value
        })
    }
    fetch(`${BASE_URL}/users`, configSignup)
        .then(response => response.json())
        .then(user => {
          if (!!user.messages){
            throw new Error(user.messages)
          } else {
            User.makePlayer(user)}
            let alertMsg = "Success! You are registered and logged-in."
            showSuccess(alertMsg)
        })
        .catch((error) => {
          console.error(error)
          const alertMsg = error
          showAlert(alertMsg)
        })
        usernameInput.value = ""
        emailInput.value = ""
        passwordInput.value = ""
        $('#signupModal').foundation('close');
  }


  static loginUser(){
    let emailInput = document.querySelector('#email-login')
    let passwordInput = document.querySelector('#pass-login')
    const newSessionRequest = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'email': emailInput.value,
        'password': passwordInput.value
      })
    };
    fetch(`${BASE_URL}/login`, newSessionRequest)
      .then((response) => response.json())
      .then(user => {
        if (!!user.messages){
          throw new Error(user.messages)
        } else {
          User.makePlayer(user)}
          let alertMsg = "Success! You are now logged-in"
          showSuccess(alertMsg)
      })
      .catch((error) => {
        console.error(error)
        const alertMsg = error
        showAlert(alertMsg)
      })
      emailInput.value =""
      passwordInput.value = ""
      $('#loginModal').foundation('close')
  }


  static makePlayer(user){
     const attributes = [user.user.email, user.user.username, user.jwt]
     const [email, username, token] = attributes;
     player = new User(email, username, token)
     console.log(player)
     showLoggedInView()
  }

// END USER CLASS
}



// GAME CLASS
class Game {

 constructor() {
   this.score = 0
   this.questionCounter = 0
   this.gameFetch()
   this.questions = {}
  }

 scorePercent(score){
   let percentage = (score/this.questionCounter) * 100
   return Math.round(percentage)
 }


// Initial Fetch from Fish Table - GET/Read
  gameFetch(){
    let headers = {}
    if (player){
      headers = {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${player.token}`
      }
    }
     fetch(`${BASE_URL}/fish`, {
       method: 'GET',
       headers: headers,
        })
      .then(resp => resp.json())
      .then(fishDataJSON => {
        if (!!fishDataJSON.messages){
          throw new Error(fishDataJSON.messages)
          return
        }
        this.questions = new Questions(fishDataJSON)
        this.gameInit()
        }
      )
      .catch((error) => {
        // console.error(error)
        const alertMsg = error
        showAlert(alertMsg)
      })
    }


  gameInit(){
    form.classList.remove('hide')
    this.newTurn()
  }

  newTurn(){
    subPrompt.classList.add('hide')
    contBtn.classList.add('hide')
    startBtn.classList.add('hide')
    submitBtn.classList.remove('hide')
    const counter = document.querySelector('#question-count')
    const image = document.querySelector('img')
    let choiceOne = document.querySelector('#choiceOne')
    let choiceTwo = document.querySelector('#choiceTwo')
    let choiceThree = document.querySelector('#choiceThree')
    let choiceFour = document.querySelector('#choiceFour')
// REFACTOR
    choiceOne.checked = false
    choiceOne.value = this.questions.currentQuestion[0][0].id
    choiceOne.labels[0].innerText = this.questions.currentQuestion[0][0].name
    choiceTwo.checked = false
    choiceTwo.value = this.questions.currentQuestion[0][1].id
    choiceTwo.labels[0].innerText = this.questions.currentQuestion[0][1].name
    choiceThree.checked = false
    choiceThree.value = this.questions.currentQuestion[0][2].id
    choiceThree.labels[0].innerText = this.questions.currentQuestion[0][2].name
    choiceFour.checked = false
    choiceFour.value = this.questions.currentQuestion[0][3].id
    choiceFour.labels[0].innerText = this.questions.currentQuestion[0][3].name
    ++this.questionCounter
    console.log("line 121 questionCounter", this.questionCounter)
    counter.firstElementChild.innerText = this.questionCounter
    mainPrompt.innerText = "What fish is this?"
    image.src = `${this.questions.correctChoice.image_url}`
    //can you use array destrucring and iteration to assign these?
  }


  checkAnswer(radioVal){
    let scorePercentage
      if (radioVal == this.questions.correctChoice.id){
        //correct
        ++newGame.score
        console.log("line 132 checkAnswer score", this.score)
        mainPrompt.innerHTML = `<i class="far fa-check-circle"></i> Well done! You are correct`
      } else {
        //incorrect
        console.log("line 137 checkAnswer incorrect score", this.score)
        mainPrompt.innerHTML = `<i class="far fa-times-circle"></i> Wrong! The correct answer is ${this.questions.correctChoice.name}.`
      }
    scorePercentage = this.scorePercent(this.score)
    updatePercentView(scorePercentage)
    this.answerView()
  }


  answerView(){
    submitBtn.classList.add('hide')
    subPrompt.classList.remove('hide')
    subPrompt.innerHTML =`Learn more about this fish <a href="${this.questions.correctChoice.details_url}" target="_blank">here.</a>`
    contBtn.classList.remove('hide')
    //startContBtn.setAttribute('name','continue')
    if (this.questions.questionSet.length == 0){
      this.endGame()
    } else {
      continueGame.apply(this)
    }
  }

  endGame(){
    contBtn.removeEventListener('click', () => {
      newTurn()
    })
    startBtn.classList.remove('hide')
    contBtn.classList.add('hide')
    form.classList.add('hide')
      if (this.score >= (this.questionCounter/2)){
        mainPrompt.innerHTML = `<i class="far fa-thumbs-up"></i> Well done! You scored ${newGame.scorePercent(this.score)}%`
        subPrompt.innerText ="Why not play another game?"
      } else {
        mainPrompt.innerHTML = `<i class="far fa-thumbs-down"></i> Oh dear! You scored ${newGame.scorePercent(this.score)}%`
        subPrompt.innerText ="Why not play another game?"
      }
    }
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
    selectChoicesForTurn(fish, questionset) {
      //shift should remove element from the questionSet array
      this.correctChoice = questionset.shift()
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
      if (this.currentQuestion.length > 0){
        this.currentQuestion = []
      }
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      this.currentQuestion.push(array)
    }




}
