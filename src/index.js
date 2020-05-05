const BACKEND_URL = 'http://localhost:3000';
const FISH_URL = 'http://localhost:3000/api/v1/fish';


document.addEventListener('DOMContentLoaded', () => {
  const mainPrompt = document.querySelector('#prompt')
  const startContBtn = document.querySelector('#start-continue')
  const subPrompt = document.querySelector('#subprompt')
  const image = document.querySelector('img')
  const questionCounter = document.querySelector('#question-count')
  const radioButtons = document.querySelector('#radio-buttons')




// INITIAL FETCH
  fetch(FISH_URL, { method: 'GET' })
    .then(resp => resp.json())
    .then(fishDataJSON => console.log(fishDataJSON));

// RENDER DETAILS OF CLICKED DOG
    dogBar.addEventListener('click', (e) => {
      const clickedDogId = parseInt(e.target.dataset.id)
      const foundDog = Dog.findDog(clickedDogId)
      dogInfo.innerHTML = foundDog.renderDetails()
    })

    function gameInitView(){
      mainPrompt.innerText = "What fish is this?"
      subPrompt.classList.add('hide')
      startContBtn.classList.add('hide')
      radioButtons.classList.remove('hide')
      //image.src = "https://myfwc.com/media/13792/bigeyescad.jpg"

    }

//DND-this ends the whole callback function for the DOMContentLoaded
});



// class Game {
//
//
// }
//
// class Questions {
//
// }
