<template>
  <div>
    <div>Hello</div>
    <h1>Lobby code: {{ lobbyCode }}</h1>
    <h1 v-if="players.length">{{ players.join(', ') }}</h1>
    <button @click="startQuiz">Start Quiz</button>
  </div>
</template>

<script>
import socketio from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      players: [],
      lobbyCode: ""
    };
  },
  mounted() {
    this.initializeSocket();
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    console.log(`Lobby code: ${this.lobbyCode}`);
    this.pollForPlayers();
  },
  methods: {
    initializeSocket() {
      this.socket = socketio(process.env.VUE_APP_SERVER_URL);
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });
    },
    pollForPlayers() {
      setInterval(() => {
        this.socket.emit('checkForPlayers', this.lobbyCode);
        this.socket.once('recentPlayers', players => {
          console.log('Current players:', players);
          this.players = players;
        });
      }, 300); 
    },
    startQuiz() {
      this.socket.emit('startQuiz', this.lobbyCode);
      // will need emit the json object of chosen questions
      console.log('Quiz started');
    }
  }
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
