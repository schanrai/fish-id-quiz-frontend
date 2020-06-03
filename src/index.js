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
const loginBtn = document.querySelector("#login-btn")
const signupBtn = document.querySelector('#signup-btn')
const profileBtn = document.querySelector('#profile-btn')

let newGame;
let player;


//VIEWS + LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  contBtn.classList.add('hide')
  startGame()
})


signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  User.createNewUser()
})

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  User.loginUser()
})

profileBtn.addEventListener('click',(e) => {
  e.preventDefault()
 player.getGameHistory()
})


contBtn.addEventListener('click', () => {
  newGame.newTurn()
})


form.addEventListener('submit', (event) => {
  event.preventDefault()
  let radioVal = getRadioVal(form, 'choices')
  newGame.checkAnswer(radioVal)
})


function startGame(){
 startBtn.addEventListener('click', () => {
   updatePercentView("--")
    newGame = new Game()
  })
}

function continueGame(){
    this.questions.selectChoicesForTurn(
      this.questions.fish, this.questions.questionSet)
}

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
  signupBtn.classList.add('hide')
  profileBtn.classList.remove('hide')
  loginBtn.innerText = "Logout"
  loginBtn.removeAttribute('data-open')
  logoutAction()
}

function logoutAction() {
  loginBtn.addEventListener('click', () => {
    player = null
    loginBtn.innerText = "Login"
    loginBtn.setAttribute('data-open','loginModal')
    profileBtn.classList.add('hide')
    signupBtn.classList.remove('hide')
    window.location.reload()
  })
}
