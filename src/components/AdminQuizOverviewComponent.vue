<template>
  <div class="container-main">
    <div class="lobby-container">
      <h1 class="lobby-code">Lobby Code: {{ lobbyCode }}</h1>
      <div v-if="players.length > 0" class="player-list">
        <h2>Players who have completed the question and got it correct will show here</h2>
        <div class="player-grid">
          <div 
            v-for="player in players" 
            :key="player" 
            :class="['player-box', {'completed-player': player.correct}]">
            {{player.username}}
            {{ player.correct ? '✅' : '❌' }}
          </div>
        </div>
      </div>
    </div>
    <button class="btn" @click="endGame">End Game</button>
  </div>
</template>

<script>
import socketio from 'socket.io-client';

export default {
  name: 'AdminQuizOverviewComponent',
  mounted() {
    this.initializeSocket();
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.pollForPlayersWhoHaveCompleted();
  },
  data() {
    return {
      socket: null,
      players: [],
      lobbyCode: null,
    };
  },
  methods: {
    initializeSocket() {
      this.socket = socketio(process.env.VUE_APP_SERVER_URL);
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });
    },
    pollForPlayersWhoHaveCompleted() {
      setInterval(() => {
        this.socket.emit('checkForPlayers', this.lobbyCode);
        this.socket.once('recentPlayers', players => {
        this.players = players;
        });
      }, 1000);
    },
    endGame() {
      this.socket.emit('endGame', this.lobbyCode);
      this.$router.push({ path: `/end/${this.lobbyCode}`,
      query: { lobbyCode: this.lobbyCode } });
    },
  },
};
</script>

<style scoped>
.container-main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  margin: 0 20px;
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

.lobby-container {
  text-align: center;
  font-family: 'Arial', sans-serif;
  color: #333;
  flex: 1;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9;
}

.lobby-code {
  color: #3a5a78;
  margin-bottom: 10px;
}

.player-list {
  margin: 20px 0;
}

.player-list h2 {
  color: #45524b;
}

.player-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  justify-content: center;
}

.player-box {
  background-color: #7e8a80; /* default background color for players */
  font-family: Arial, Helvetica, sans-serif;
  font-size: large;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 5px;
  white-space: nowrap;
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
  margin: 20px auto;
}

.btn:hover {
  background-color: #3a5a78;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
.completed-player {
  background-color: #4CAF50; /* Green background for completed players */
}

@media (max-width: 768px) {
  .container-main {
    flex-direction: column;
  }

  .btn {
    width: auto;
  }
}

</style>
