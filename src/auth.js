function loginUser(){
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
    .then(response => response.json())
    .then(user => {
      if (!!user.messages){
        throw new Error(user.messages)
      } else {
        let attr = {
          email: user.user.email,
          username: user.user.username,
          token: user.jwt,
        }
       User.current_player = new User(attr)
       sessionStorage.setItem('player',JSON.stringify(User.current_player ))
    }
        let alertMsg = "Success! You are now logged-in"
        showSuccess(alertMsg)
        showLoggedInView()
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

function createNewUser(){
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
         let attr = {
           email: user.user.email,
           username: user.user.username,
           token: user.jwt,
         }
        User.current_player = new User(attr)
        sessionStorage.setItem('player',JSON.stringify(User.current_player))
       }
         let alertMsg = "Success! You are registered and logged-in."
         showSuccess(alertMsg)
         showLoggedInView()
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


const currentUser = () => {
  return JSON.parse(sessionStorage.getItem('player'))
}

const currentGame = () => {
  return JSON.parse(sessionStorage.getItem('game'))
}
