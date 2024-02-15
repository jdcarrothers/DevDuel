<template>
  <div class="container">
    <p class="intro-text">Connect to a game by entering the game ID and your name. Host a game by clicking the host button.</p>

    <div class="connect">
      <label for="lobbyID" class="input-label">Game ID</label>
      <input id="lobbyID" v-model="joinCredLobbyID" type="text" placeholder="Enter Lobby ID" class="input-field">

      <label for="username" class="input-label">Nickname</label>
      <input id="username" v-model="joinCredUsername" type="text" placeholder="Enter Your Nickname" class="input-field">

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
  margin: 40px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9;
}

h2 {
  color: #4a76a8;
  font-size: 2em; /* Larger and more prominent */
  margin-bottom: 20px;
}

.intro-text {
  color: #45524b; /* Darker color for better readability */
  margin-bottom: 20px;
  font-size: 1.2em; /* Slightly larger font size for prominence */
  line-height: 1.6; /* Improved line height for readability */
  font-weight: 600; /* Slightly bold but not as much as headers */
  max-width: 80%; /* Max width for optimal reading length */
  margin-left: auto; /* Centering the paragraph */
  margin-right: auto; /* Centering the paragraph */
}

.input-label {
  display: block;
  color: #4a76a8; /* Blue theme color for consistency */
  margin-bottom: 5px;
  font-size: 1em;
}

.input-field {
  padding: 10px;
  margin-bottom: 20px;
  border: 2px solid #d0d9e6; /* Consistent with theme */
  border-radius: 4px;
  width: 80%;
  font-family: 'Arial', sans-serif;
}

.btn {
  background-color: #2f5683;
  color: white;
  padding: 15px 30px;
  font-size: 1.1em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  margin-top: 20px;
}

.btn:hover {
  background-color: #3a5a78;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.separator {
  color: #888;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .container {
    padding: 20px 10px;
  }

  .input-field, .btn {
    width: 90%; /* Adjust input and button width for smaller screens */
  }
}
</style>