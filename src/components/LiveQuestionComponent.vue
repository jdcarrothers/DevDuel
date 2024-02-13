<template>
  <div class="container">
    <div class="buttons">
      <button @click="runCodeAndGetSubmissionToken">Submit code</button>
    </div>
    <div class="editor">
      <div class="problem">
        <h1>{{ Languagel }}</h1>
        <h1>What you have to solve:</h1>
        <p>{{ Question }}</p>
        <h1>Example output:</h1>
        <div v-html="ExpectedOutput" ></div>
      </div>
      <codemirror ref="myCodeMirror" v-model="code" :extensions="extensions" class="code-editor"/>
      <textarea v-model="codeOutput" class="output"></textarea>
    </div>
  </div>
</template>

<script>
import { Codemirror } from 'vue-codemirror';
import { javascript} from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import socketio from 'socket.io-client';
import axios from 'axios';

export default {
  name: 'CodeEditorComponent',
  components: {
    Codemirror
  },
  data() {
    return {
      lobbyCode: null,
      socket: null,
      possibleLanguages: ['JavaScript', 'Python'],
      pickedLanguage: 'JavaScript',
      code: `console.log('Hello, World!')`,
      codeOutput: 'When you run your code, the output will be displayed here.',
      extensions: [javascript(), oneDark, EditorView.theme({
        '&': {
          height: '60vh', // Set the height of the editor
          overflow: 'auto', // Enable scroll
        }
      })],
      i: 0,
      judgeReply: '',
      encodedCode: '',
      encodedExpectedOutput: '',
      Question: '',
      Languagel: '',
      ExpectedOutput: '',
    };
  },
  methods: {
    getLanguageMode(language) {
      switch (language.toLowerCase()) {
        case 'javascript':
          this.code = `console.log('Hello, World!')`;
          return javascript();
        case 'python':
          this.code = `print('Hello, World!')`;
          return python();
        default:
          return javascript();
      }
    },
    toggleCodeMirrorMode() {
      this.i = (this.i + 1) % this.possibleLanguages.length;
      this.pickedLanguage = this.possibleLanguages[this.i];
      this.extensions = [this.getLanguageMode(this.pickedLanguage), oneDark, EditorView.theme({
        '&': {
          height: '60vh',
          overflow: 'auto',
        }
      })];
    },
    async runCodeAndGetSubmissionToken() {
      this.encodedCode = btoa(this.code);
      this.encodedExpectedOutput = btoa(this.codeOutput);

      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
          base64_encoded: 'true',
          fields: '*'
        },
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.VUE_APP_X_RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
          language_id: 71,
          source_code: this.encodedCode,
          stdin: this.encodedExpectedOutput
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        this.judgeReply = response.data.token;
        this.getSubmissionTokenData();
      } catch (error) {
        console.error(error);
      }
    },
    async getSubmissionTokenData() {
      const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${this.judgeReply}`,
        params: {
          base64_encoded: 'true',
          fields: '*'
        },
        headers: {
          'X-RapidAPI-Key': process.env.VUE_APP_X_RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      };

      try {
        let response = await axios.request(options);

        while (response.data.status.id === 2 || response.data.status.id === 1) { 
          await new Promise(resolve => setTimeout(resolve, 2000)); 
          response = await axios.request(options);
        }

        if (response.data.stdout) {
          response.data.stdout = atob(response.data.stdout);
        }
        if (response.data.stderr) {
          response.data.stderr = atob(response.data.stderr);
        }

        this.codeOutput = response.data.stdout || response.data.stderr || "No output";
        console.log(this.codeOutput);
        console.log(typeof this.codeOutput)
        this.codeOutput = String(this.codeOutput);
        
        
        if (this.codeOutput.trim() === this.ExpectedOutput.trim()) { {
          alert("Correct answer");
        }} else {
          alert("Incorrect answer");
        }
      } catch (error) {
        console.error(error);
      }
    },
    initializeSocket() {
      this.socket = socketio(process.env.VUE_APP_SERVER_URL);
      this.socket.on('connect', () => {
        this.loadCorrectQuestion();
      });
    },
    loadCorrectQuestion() {
      this.socket.emit('getQuestion', this.lobbyCode);
      this.socket.once('receivedQuetion', question => {
        this.Question = question.Question;
        this.ExpectedOutput = question.ExpectedOutput;
        this.ExpectedOutput = String(this.ExpectedOutput);
        this.Languagel = question.Language;
      });
    }
  },
  mounted() {
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.initializeSocket();
  }
}
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: rgb(69, 74, 83);
  color:  #ffffff;
}

.buttons button {
  background-color: #4CAF50; 
  border: none; 
  color: white; 
  padding: 10px 20px;
  text-align: center;
  text-decoration: none; 
  display: inline-block; 
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px; 
  margin: 0 10px; 
  transition-duration: 0.4s;
}

.buttons button:hover {
  background-color: #2c740b; 
}

.editor {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  height: calc(100% - 40px);
  align-content: start;
}

.problem {
  grid-column: 1;
  grid-row: 1 / span 2;
}

.code-editor {
  grid-column: 2;
  grid-row: 1;
}
.output {
  grid-column: 2;
  grid-row: 2;
}
</style>