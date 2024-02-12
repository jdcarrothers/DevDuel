<template>
  <div class="container">
    <h2>Welcome to the Game Lobby</h2>
    <p>Connect to a game by entering the game ID and your name. Host a game by clicking the host button.</p>

    <div class="connect">
      <label for="lobbyID">Game ID</label>
      <input id="lobbyID" v-model="joinCredLobbyID" type="text" placeholder="Enter Lobby ID">

      <label for="username">Username</label>
      <input id="username" v-model="joinCredUsername" type="text" placeholder="Enter Your Name">

      <button class="btn" @click="connectToGame">Connect</button>
    </div>

    <div class="separator">OR</div>

    <div class="host">
      <button class="btn" @click="hostGame">Host a New Game</button>
    </div>
  </div>
</template>

<script>
import socketio from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      joinCredUsername: "",
      joinCredLobbyID: ""
    };
  },
  computed: {
    lobbyCodeFromParams() {
      return this.$route.params.lobbyCode;
    }
  },
  mounted() {
    this.socket = socketio(process.env.VUE_APP_SERVER_URL);
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
  },
  methods: {
    connectToGame() {
      const joinLobbyRequest = {
        userID: this.joinCredUsername,
        lobbyID: this.joinCredLobbyID
      };
      this.socket.emit('joinLobbyRequest', joinLobbyRequest);
      this.socket.once('lobbyJoinResponse', success => {
        if (success) {
          this.$router.push({
            path: `/join/${this.joinCredLobbyID}`,
            query: {
              lobbyCode: this.joinCredLobbyID,
              username: this.joinCredUsername
            },
            params: {
              lobbyCode: this.joinCredLobbyID,
              username: this.joinCredUsername
            }
          });
        } else {
          alert('Lobby does not exist');
        }
      });
    },
    hostGame() {
      this.socket.emit('createLobbyRequest');
      this.socket.once('lobbyCreated', newLobby => {
        this.$router.push({
          path: `/host/${newLobby.lobbyCode}`,
          query: { lobbyCode: newLobby.lobbyCode }
        });
      });
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  font-family: 'Arial', sans-serif;
  color: #333;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

h2 {
  color: #4a76a8;
}

.connect, .host {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #45524b;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin: 10px 0;
}

.connect input, .host input {
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  width: 80%;
}

.btn {
  background-color: #4a76a8;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3a5a78;
}

.separator {
  color: #888;
  margin: 20px 0;
}

label {
  margin-top: 10px;
  font-weight: bold;
}
</style>
