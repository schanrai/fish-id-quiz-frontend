class User {
  constructor(attr){ //email, username, token)
    this.email = attr.user.email;
    this.username = attr.user.username;
    this.token = attr.jwt;
    User.current_player = undefined
  }

saveScore(finalScore){
    let headers = {}
    if (!!User.current_player){
      headers = {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${User.current_player.token}`
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
    .then(response => response.json())
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


 getGameHistory(){
    let headers = {}
    debugger
    let player = currentUser()
    //refactor below to if (player)
    //should you make the above global so you don't have to keep calling it again and again? Keep it DRY
    //or should I carry on using User.current_player and just populate it in the event of a page reload?
      if (!!player){
      headers = {
        'Content-type': 'application/json',
        //'Authorization': `Bearer ${player.token}`
        'Authorization': `Bearer ${User.current_player.token}`
      }
    }
    fetch(`${BASE_URL}/game_histories`, {
      method: 'GET',
      headers: headers,
       })
     .then(resp => resp.json())
     .then(gameHistoryJSON => {
       if (!!gameHistoryJSON.messages){
         throw new Error(gameHistoryJSON.messages)
         return
       }
       renderProfile(gameHistoryJSON)
       }
     )
     .catch((error) => {
       // console.error(error)
       const alertMsg = error
       showAlert(alertMsg)
     })
  }



//END USER CLASS
}
