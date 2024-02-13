<template>
  <div class="container-main">
    <div class="lobby-container">
      <div class="header">Welcome to the Quiz Lobby</div>
      <h1 class="lobby-code">Lobby code: {{ lobbyCode }}</h1>
      <div v-if="players.length" class="player-list">
        <h2>Players:</h2>
        <div class="player-grid">
          <div v-for="player in players" :key="player" class="player-box">{{ player }}</div>
        </div>
      </div>
      <button class="btn" @click="startQuiz">Start Quiz</button>
    </div>
    <div class="question-container">
      <h2>{{QuestionDecisionHeader}}</h2>
      <button class="btn" id = "1" @click="pickRandomQuestion()" >{{ btnOneText }}</button>
      <h2>Selected Question</h2>
      <div class="selected-question">
        <h1 :style="{ color: '#3a5a78', marginBottom: '10px' }">{{ Language }}</h1>
        <h2 :style="{ color: '#4a76a8', marginBottom: '10px' }"> {{ Question }}</h2>
        <div v-html="ExpectedOutput" ></div>
      </div>
    </div>
</div>
</template>

<script>
import socketio from 'socket.io-client';

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
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });
    },
    pollForPlayers() {
      setInterval(() => {
        this.socket.emit('checkForPlayers', this.lobbyCode);
        this.socket.once('recentPlayers', players => {
          this.players = players;
        });
      }, 300); // Polling interval in milliseconds
    },
    startQuiz() {
      this.socket.emit('startQuiz', this.lobbyCode);
      alert('Quiz started!');
    },
    pickRandomQuestion() {
      this.QuestionDecisionHeader = "Loading a random question... ";
      this.btnOneText = "Selected";
      this.socket.emit('requestRandomQuestion', this.lobbyCode);
      this.socket.once('questionSent', question => {
        if(question.Question === this.Question){
          this.pickRandomQuestion();
        }
        this.QuestionDecisionHeader = "Question selected!";
        this.btnOneText = "Refresh to select another question";
        this.Question = question.Question;
        this.Language = question.Language;
        this.ExpectedOutput = "The expected output\n"+ question.ExpectedOutput ;
        console.log(question);
      });
      
    },
  }
};
</script>

<style scoped>
.lobby-container {
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

.header {
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
  background-color: #4a76a8;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;
}

.btn:hover {
  background-color: #3a5a78;
}
.player-list {
  margin: 20px 0;
}

.player-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  justify-content: center; /* Center the boxes */
}

.player-box {
  display: inline-block;
  background-color: #4a76a8;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 5px;
  white-space: nowrap; /* Prevents text from wrapping */
}
.question-container {
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
.selected-question {
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

</style>
