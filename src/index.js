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
const signupBtn = document.querySelector('#signup-profile-btn')

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
  signupBtn.innerText = "Profile"
  signupBtn.setAttribute('data-open','profileModal')
  signupBtn.setAttribute('aria-controls','profileModal')
  loginBtn.innerText = "Logout"
  loginBtn.removeAttribute('data-open')
  logoutAction()
}

function logoutAction() {
  loginBtn.addEventListener('click', () => {
    player = null
    loginBtn.innerText = "Login"
    loginBtn.setAttribute('data-open','loginModal')
    signupBtn.setAttribute('data-open','signupModal')
    signupBtn.setAttribute('aria-controls','signupModal')
    signupBtn.innerText = "Signup"
  })
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

  static saveScore(finalScore){
    let headers = {}
    if (player){
      headers = {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${player.token}`
      }
    }
    const scorePost = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        'score': finalScore
      })
    };
    fetch(`${BASE_URL}/game_histories`, scorePost)
    .then((response) => response.json())
    .then(game_history => {
      if (!!game_history.messages){
        throw new Error(game_history.messages)
      } else {
        let alertMsg = "Score updated to profile."
        showSuccess(alertMsg)}
    })
    .catch((error) => {
      console.error(error)
      const alertMsg = error
      showAlert(alertMsg)
    })
  }




// END USER CLASS
}
