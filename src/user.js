class User {
  constructor(attr){ //email, username, token)
    this.email = attr.email;
    this.username = attr.username;
    this.token = attr.token;
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
      if (!!User.current_player){
      headers = {
        'Content-type': 'application/json',
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


}
