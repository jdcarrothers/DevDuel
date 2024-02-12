<template>
  <div>
    <h1>Lobby code: {{ lobbyCode }} Username: {{ username }}</h1>
    <h1>Waiting on host to start</h1>
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
        console.log('Checking for game start');
        this.socket.emit('checkForGameStart', this.lobbyCode);
        this.socket.once('gameStartCheck', gameStatus => {
          console.log(gameStatus);
          if (gameStatus !== "notStarted") {
            clearInterval(intervalId);
            this.navigateToGame();
          }
        });
      }, 1000);
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
/* Your scoped styles here */
</style>
