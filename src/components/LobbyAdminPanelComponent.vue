<template>
  <div class="container-main">
    <div class="lobby-container">
      <h1 class="lobby-code">Lobby code: {{ lobbyCode }}</h1>
      <div v-if="players.length" class="player-list">
        <h2>Players:</h2>
        <div class="player-grid">
          <div v-for="player in players" :key="player" class="player-box">
            {{ player.username }}
          </div>
        </div>
      </div>
      <button class="btn" @click="startQuiz">Start Quiz</button>
    </div>
    <div class="question-container">
      <h2>{{ QuestionDecisionHeader }}</h2>
      <button class="btn" id="1" @click="pickRandomQuestion()">{{ btnOneText }}</button>
      <h2>Selected Question</h2>
      <div class="selected-question">
        <h1 :style="{ color: '#3a5a78', marginBottom: '10px' }">{{ Language }}</h1>
        <h2 :style="{ color: '#4a76a8', marginBottom: '10px' }">{{ Question }}</h2>
        <div v-html="ExpectedOutput"></div>
      </div>
    </div>
  </div>
</template>

<script>
import socketio from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      players: [],
      lobbyCode: "",
      choice: " ", // Remove the extra space
      QuestionDecisionHeader: "Choose an option",
      btnOneText: "Select a random coding problem",
      Question: "",
      Language: " ",
      ExpectedOutput: " ",
    };
  },
  mounted() {
    this.initializeSocket();
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.pollForPlayers();
  },
  methods: {
    initializeSocket() {
      this.socket = socketio(process.env.VUE_APP_SERVER_URL);
      this.socket.on("connect", () => {
        console.log("Connected to server");
      });
    },
    pollForPlayers() {
      setInterval(() => {
        this.socket.emit("checkForPlayers", this.lobbyCode);
        this.socket.once("recentPlayers", (players) => {
          this.players = players;
        });
      }, 300);
    },
    startQuiz() {
      this.socket.emit("startQuiz", this.lobbyCode);
      this.$router.push({
        path: `/admin/${this.lobbyCode}`,
        query: {
          lobbyCode: this.lobbyCode,
        },
        params: {
          lobbyCode: this.lobbyCode,
        },
      }); // Redirect to the quiz page
    },
    pickRandomQuestion() {
      this.QuestionDecisionHeader = "Loading a random question... ";
      this.btnOneText = "Selected";
      this.socket.emit("requestRandomQuestion", this.lobbyCode);
      this.socket.once("questionSent", (question) => {
        if (question.Question === this.Question) {
          this.pickRandomQuestion();
        }
        this.QuestionDecisionHeader = "Question selected!";
        this.btnOneText = "Refresh to select another question";
        this.Question = question.Question;
        this.Language = question.Language;
        this.ExpectedOutput = "The expected output: " + question.ExpectedOutput;
        console.log(question);
      });
    },
  },
};
</script>

<style scoped>
.container-main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch; /* Adjust containers to the same height */
  margin: 0 20px;
}

.lobby-container,
.question-container {
  text-align: center;
  font-family: "Arial", sans-serif;
  color: #333;
  flex: 1; /* Assign equal importance to both containers */
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9;
}

.header,
.selected-question h1,
.selected-question h2 {
  color: #4a76a8;
  margin-bottom: 20px;
}

.lobby-code {
  color: #3a5a78;
  margin-bottom: 10px;
}

.player-list h2 {
  color: #45524b;
}

.btn {
  background-color: #2f5683;
  color: white;
  padding: 15px 30px; /* Increased padding for better clickability */
  font-size: 1.1em; /* Slightly larger text */
  border: none;
  border-radius: 8px; /* Rounded corners */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adding shadow for depth */
  width: 80%; /* Making button wider */
  margin: 20px auto; /* Center button in the container */
}

.btn:hover {
  background-color: #3a5a78;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Enhanced hover effect */
}

.player-list {
  margin: 20px 0;
}

.player-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  justify-content: center;
}

.player-box {
  background-color: #4a76a8;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 5px;
  white-space: nowrap;
}

.question-container {
  text-align: center;
  font-family: "Arial", sans-serif;
  color: #333;
  flex: 1;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9; /* Consistent background color */
}

.selected-question h2 {
  font-size: 1.2em; /* Slightly larger font size */
}

.selected-question h1 {
  font-size: 1.4em; /* Slightly larger font size */
}

.selected-question {
  background-color: #e6eef8;
  padding: 20px; /* Increased padding */
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Inset shadow for depth */
  margin-top: 20px;
  text-align: left; /* Align text to the left for readability */
}

.selected-question div {
  background-color: #d0d9e6;
  padding: 15px;
  border-radius: 8px;
  font-family: "Courier New", Courier, monospace; /* Monospaced font for code */
  white-space: pre-wrap; /* Preserve whitespace and formatting */
}

@media (max-width: 768px) {
  .container-main {
    flex-direction: column; /* Stack containers on top of each other */
  }

  .btn {
    width: auto; /* Adjust button width for smaller screens */
  }
}
</style>
