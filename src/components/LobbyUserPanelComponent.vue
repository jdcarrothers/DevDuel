<template>
  <div class="waiting-lobby-container">
    <div class="lobby-details">
      <h1>Lobby code: {{ lobbyCode }}</h1>
      <h2>Username: {{ username }}</h2>
    </div>
    <h2 class="waiting-message">Waiting on host to start</h2>
  </div>
</template>

<script>
import socketio from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      lobbyCode: null,
      username: "",
    };
  },
  mounted() {
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.username = this.$route.query.username || this.$route.params.username;
    this.initializeSocket();
    this.checkGameStart();
  },
  methods: {
    initializeSocket() {
      this.socket = socketio(process.env.VUE_APP_SERVER_URL);
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });
    },
    checkGameStart() {
      const intervalId = setInterval(() => {
        this.socket.emit('checkForGameStart', this.lobbyCode);
        this.socket.once('gameStartCheck', gameStatus => {
          if (gameStatus !== "notStarted") {
            clearInterval(intervalId);
            this.navigateToGame();
          }
        });
      }, 300);
    },
    navigateToGame() {
      this.$router.push({
        path: `/lobby/${this.lobbyCode}`,
        query: { lobbyCode: this.lobbyCode, username: this.username }
      });
    }
  }
}
</script>

<style scoped>
.waiting-lobby-container {
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

.lobby-details {
  color: #3a5a78;
  margin-bottom: 10px;
}

.waiting-message {
  color: #45524b;
  font-size: 1.2em;
}
</style>
