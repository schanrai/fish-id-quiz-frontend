class Game {

 constructor() {
   this.score = 0
   this.questionCounter = 0
   this.questions = {}
   Game.newGame = undefined
  }

 scorePercent(score){
   let percentage = (score/this.questionCounter) * 100
   return Math.round(percentage)
 }


// Initial Fetch from Fish Table - GET/Read
  gameFetch(){
    let headers = {}
    if (!!User.current_player){
      headers = {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${User.current_player.token}`
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
        this.newTurn()
        }
      )
      .catch((error) => {
        console.error(error)
        const alertMsg = error
        showAlert(alertMsg)
      })
    }



  newTurn(){
    form.classList.remove('hide')
    subPrompt.classList.add('hide')
    contBtn.classList.add('hide')
    startBtn.classList.add('hide')
    submitBtn.classList.remove('hide')
    let choices = []
    const counter = document.querySelector('#question-count')
    const image = document.querySelector('img')
    let choiceOne = document.querySelector('#choiceOne')
    let choiceTwo = document.querySelector('#choiceTwo')
    let choiceThree = document.querySelector('#choiceThree')
    let choiceFour = document.querySelector('#choiceFour')
    choices.push(choiceOne, choiceTwo, choiceThree, choiceFour)
    for (let i = 0; i < choices.length; i++){
      choices[i].checked = false;
      choices[i].value = this.questions.currentQuestion[i].id;
      choices[i].labels[0].innerText = this.questions.currentQuestion[i].name;
    }
    counter.firstElementChild.innerText = this.questionCounter
    mainPrompt.innerText = "What fish is this?"
    image.src = `${this.questions.correctChoice.image_url}`
    sessionStorage.setItem('game',JSON.stringify(Game.newGame))
    this.updateProgress()
  }

  updateProgress(){
    let progressPercent = (this.questionCounter / numTurns) * 100
    const progressMeter = document.querySelector(".progress-meter")
    progressMeter.style.width = `${progressPercent}%`
    const progressBar = document.querySelector(".progress.warning")
    progressBar.ariaValueNow = `${progressPercent}`
  }

  checkAnswer(radioVal){
    let scorePercentage
      if (radioVal == this.questions.correctChoice.id){
        //correct
        ++this.score
        mainPrompt.innerHTML = `<i class="far fa-check-circle"></i> Well done! You are correct`
      } else {
        //incorrect
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
    if (this.questions.questionSet.length == 0){
      //do a setTimeout on endGame?
      this.endGame()
      return
    }
    this.continueGame()
  }

  continueGame(){
    console.log("inside the continueGame method")
     this.questions.selectChoicesForTurn(
       this.questions.fish, this.questions.questionSet)
 }

  endGame(){
    contBtn.removeEventListener('click', () => {
      newTurn()
    })
    startBtn.classList.remove('hide')
    contBtn.classList.add('hide')
    form.classList.add('hide')
    let finalScore = this.scorePercent(this.score)
    User.current_player.saveScore(finalScore)
    sessionStorage.removeItem('game')
      if (this.score >= (this.questionCounter/2)){
        mainPrompt.innerHTML = `<i class="far fa-thumbs-up"></i> Well done! You scored ${this.scorePercent(this.score)}%`
        subPrompt.innerText ="Why not play another game?"
      } else {
        mainPrompt.innerHTML = `<i class="far fa-thumbs-down"></i> Oh dear! You scored ${this.scorePercent(this.score)}%`
        subPrompt.innerText ="Why not play another game?"
      }
    }
}
