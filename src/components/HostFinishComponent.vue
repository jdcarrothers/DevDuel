<template>
  <div class="leaderboard-container">
    <h2 class="leaderboard-title">You ended the game!</h2>
    <div class="leaderboard">
      <h3 class="leaderboard-header">Leaderboard</h3>
      <ul class="leaderboard-list">
        <li><strong>1st:</strong> {{ this.first }}</li>
        <li><strong>2nd:</strong> {{ this.second }}</li>
        <li><strong>3rd:</strong> {{ this.third }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import socketio from "socket.io-client";
export default {
  name: "HostFinishComponent",
  data() {
    return {
      socket: null,
      lobbyCode: null,
      first: "",
      second: "",
      third: "",
    };
  },
  mounted() {
    this.socket = socketio(process.env.VUE_APP_SERVER_URL);
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.socket.emit("endGame", this.lobbyCode);
    this.socket.once("gameEnded", (arrayOfPlayers) => {
      if (arrayOfPlayers[0]) {
        this.first = arrayOfPlayers[0];
      }
      if (arrayOfPlayers[1]) {
        this.second = arrayOfPlayers[1];
      }
      if (arrayOfPlayers[2]) {
        this.third = arrayOfPlayers[2];
      }
    });
  },
};
</script>

<style scoped>
.leaderboard-container {
  text-align: center;
  font-family: "Arial", sans-serif;
  color: #333;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9;
  margin: 20px auto; /* Center the container */
  max-width: 500px; /* Ensure the container doesn't stretch too wide */
}

.leaderboard-title {
  color: #3a5a78;
  margin-bottom: 20px;
}

.leaderboard-header {
  color: #4a76a8;
  margin-bottom: 10px;
}

.leaderboard-list {
  list-style: none;
  padding: 0;
}

.leaderboard-list li {
  background-color: #e6eef8;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: "Courier New", Courier, monospace;
}
</style>
