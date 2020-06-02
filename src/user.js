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
        let alertMsg = "Score saved to profile."
        showSuccess(alertMsg)}
    })
    .catch((error) => {
      console.error(error)
      const alertMsg = error
      showAlert(alertMsg)
    })
  }


}
