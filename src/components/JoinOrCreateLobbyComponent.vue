<template>
  <div class="container">
    <p>Connect to a game by entering the game ID and your name. Host a game by clicking the host button.</p>

    <div class="connect">
      <h1>ID</h1>
      <input v-model="joinCredLobbyID" type="text">
      <input v-model="joinCredUsername" type="text">
      <button @click="connectToGame">Connect</button>
    </div>

    <p>OR</p>

    <div class="host">
      <button @click="hostGame">Host</button>
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
.connect, .host {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(69, 74, 83);
  color: #ffffff;
}

.connect {
  height: 30vh;
  width: 50vh;
}

/* Additional styling here */
</style>
