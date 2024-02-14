// Lobby object constructor
function Lobby(lobbyCode) {
    this.lobbyCode = lobbyCode; 
    this.players = []; // Array to store players in the lobby
    this.began = false; // Boolean to check if the game has begun
    this.currentQuestion = null; // Object to store the current question
}


module.exports = Lobby;