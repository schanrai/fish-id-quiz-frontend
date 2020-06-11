const BASE_URL = 'http://localhost:3000/api/v1';
const numTurns = 5

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

//let newGame;
//let player;


//VIEWS + LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  //load user properties from sessionStorage + assigns to player
  let player = currentUser()
  if (!!player){
  //if player can be populated with sessionStorage variables,
  //then create instance of User with those variables
    User.current_player = new User(player)
    showLoggedInView()
  }
})

signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  createNewUser()
})

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  loginUser()
})

//You have to use User.current_player, because getGameHistory only works on instances of User Object
profileBtn.addEventListener('click',(e) => {
  e.preventDefault()
  User.current_player.getGameHistory()
})

startBtn.addEventListener('click', () => {
  updatePercentView("--")
   Game.newGame = new Game()
   Game.newGame.gameFetch()
 })


contBtn.addEventListener('click', () => {
  Game.newGame.newTurn()
})


form.addEventListener('submit', (event) => {
  event.preventDefault()
  let radioVal = getRadioVal(form, 'choices')
  Game.newGame.checkAnswer(radioVal)
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
  signupBtn.classList.add('hide')
  profileBtn.classList.remove('hide')
  loginBtn.innerText = "Logout"
  loginBtn.removeAttribute('data-open')
  logoutAction()
}

function logoutAction() {
  loginBtn.addEventListener('click', () => {
    player = null
    sessionStorage.clear()
    loginBtn.innerText = "Login"
    loginBtn.setAttribute('data-open','loginModal')
    profileBtn.classList.add('hide')
    signupBtn.classList.remove('hide')
    window.location.reload()
  })
}

function renderProfile(gameHistoryJSON){
  score.innerHTML = ""
  date.innerHTML = ""
  const profileUsername = document.querySelector('#username')
  profileUsername.innerText = `${User.current_player.username}`
  if (!gameHistoryJSON || !gameHistoryJSON.length) {
    return
  } else {
  calcUserStats(gameHistoryJSON)
  const score =  document.querySelector('#score')
  const date =  document.querySelector('#date')
  gameHistoryJSON.map(x => {
    var d = new Date(x.created_at)
    var n = d.toLocaleDateString()
    score.innerHTML += `<li>${x.score}</li>`
    date.innerHTML += `<li>${n}</li>`
      })
    }
  }

function calcUserStats(gameHistoryJSON){
  let result
  result = Math.max(...gameHistoryJSON.map(elem => elem.score))
  const quizzes =  document.querySelector('#quizzes-total')
  const highScore =  document.querySelector('#high-score')
  quizzes.innerText = `Quizzes taken: ${gameHistoryJSON.length}`
  highScore.innerText = `High score: ${result}`
}
