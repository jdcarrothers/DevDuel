<template>
<div class="container">
    <button class="button" @click="runCodeAndGetSubmissionToken">Submit Code</button>
    <codemirror ref="myCodeMirror" v-model="code" :extensions="extensions" class="code-editor"></codemirror>
    {{ Language }}
    {{ Question }}
    <div v-html="ExpectedOutput"> </div>
    <textarea v-model="codeOutput" class="output"></textarea>
</div>
</template>

<script>
import { Codemirror } from 'vue-codemirror';
// import { javascript} from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { oneDark } from '@codemirror/theme-one-dark';
// import { EditorView } from '@codemirror/view';
import socketio from 'socket.io-client';
import axios from 'axios';

export default {
name: 'LiveComponent',
components: {
    Codemirror
},
data() {
    return {
    code: '', 
    extensions: [], 
    socket: null, 
    lobbyCode: null,
    ExpectedOutput:"",
    Question: "",
    Language: "",
    codeOutput: "",
    };
},
mounted() {
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.initializeSocket();
    this.loadCorrectQuestion();
  },
methods: {
    initializeSocket() {
        this.socket = socketio(process.env.VUE_APP_SERVER_URL);
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
    },
    async runCodeAndGetSubmissionToken() {
        this.encodedCode = btoa(this.code);

        const optionsSubmit = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
            base64_encoded: 'true',
            fields: '*'
            },
            headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.VUE_APP_X_RAPID_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
            language_id: 71,
            source_code: this.encodedCode,
            }
        };
  try {
    const responseSubmit = await axios.request(optionsSubmit);
    console.log(responseSubmit.data);
    this.judgeReply = responseSubmit.data.token;

    const optionsGet = {
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

    let responseGet = await axios.request(optionsGet);

    while (responseGet.data.status.id === 2 || responseGet.data.status.id === 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      responseGet = await axios.request(optionsGet);
    }

    if (responseGet.data.stdout) {
      responseGet.data.stdout = atob(responseGet.data.stdout);
    }
    if (responseGet.data.stderr) {
      responseGet.data.stderr = atob(responseGet.data.stderr);
    }

    this.codeOutput = responseGet.data.stdout || responseGet.data.stderr || "No output";
    this.codeOutput = String(this.codeOutput);
    if (this.codeOutput.trim() === this.ExpectedOutput.trim()) {
      alert("Correct answer");
    } else {
      alert("Incorrect answer");
    }
  } catch (error) {
    console.error(error);
  }
},

  loadCorrectQuestion() {
        this.socket.emit('getQuestion', this.lobbyCode);
        this.socket.once('receivedQuetion', question => {
          this.Question = question.Question;
          this.ExpectedOutput = question.ExpectedOutput;
          this.ExpectedOutput = String(this.ExpectedOutput);
          this.Languagel = question.Language;
        });

    },
}
};
</script>

<style scoped>
/* Your component styles here */
</style>
