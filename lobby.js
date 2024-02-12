// Lobby object constructor
function Lobby(lobbyCode) {
    this.lobbyCode = lobbyCode; 
    this.players = []; // Array to store players in the lobby
    this.began = false; // Boolean to check if the game has begun
}

Lobby.prototype.addplayer = function(player) {
        this.players.push(player);
        console.log(`${player} joined ${this.lobbyCode} lobby.`);
};

Lobby.prototype.removeplayer = function(player) {
    const index = this.players.indexOf(player);
    if (index !== -1) {
        this.players.splice(index, 1);
        console.log(`${player} left ${this.lobbyCode} lobby.`);
    } else {
        console.log(`${player} is not in ${this.lobbyCode} lobby.`);
    }
};

// Method to display players in the lobby
Lobby.prototype.displayplayers = function() {
    console.log(`players in ${this.lobbyCode} lobby:`);
    this.players.forEach(player => console.log(player));
};

module.exports = Lobby;