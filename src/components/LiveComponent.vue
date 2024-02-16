<template>
  <div class="coding-container">
    <div class="problem-container">
      <h1 :style="{ color: '#3a5a78', marginBottom: '10px' }">{{ Language }}</h1>
      <h2 :style="{ color: '#4a76a8', marginBottom: '10px' }"> {{ Question }}</h2>
      <div v-html="ExpectedOutput"></div>
    </div>
    <div class="editor-and-button-container">
      <codemirror ref="myCodeMirror" v-model="code" :extensions="extensions" class="code-editor"></codemirror>
      <button class="btn" @click="runCodeAndGetSubmissionToken">Submit Code</button>
      <h1 :style="{ color: '#3a5a78', marginBottom: '10px' }">When you run the code your output will be below</h1>
      <div class="output-container">
        <textarea v-model="codeOutput" class="output"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { Codemirror } from "vue-codemirror";
import { EditorView } from "@codemirror/view";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
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
    language_id: null,
    ActualOutput: "",
    username: "",
    };
},
mounted() {
    this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
    this.username = this.$route.query.username || this.$route.params.username;
    this.initializeSocket();
    this.loadCorrectQuestion();
  },
methods: {
      async evaluateCodeCleanliness() {
        try {
            const response = await axios.post('https://harmonious-marshmallow-62274e.netlify.app:2000/evaluate-code', {
                question: this.Question,
                language: this.Language,
                codeSnippet: this.code,
                expectedOutput: this.ExpectedOutput
            });

            await axios.post('https://harmonious-marshmallow-62274e.netlify.app:2000/updateDB', {
                username: localStorage.getItem('username'),
                newCodeRating: response.data.codeRating
            });
        } catch (error) {
            console.error('Error evaluating code cleanliness:', error);
        }
    },
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
              language_id: this.language_id,
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
    if (this.codeOutput.trim() === this.ActualOutput.trim()) {
      const jsonObject = {
        lobbyID: this.lobbyCode,
        username: this.username,
        };
        JSON.stringify(jsonObject);
      this.socket.emit('correctAnswerAlert', jsonObject);
      this.evaulateCodeCleanliness()
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
          this.ExpectedOutput = "Expected output:\n\n" + String(question.ExpectedOutput);
          this.Language = question.Language;
          this.ActualOutput = question.ActualOutput;
          this.loadRequestProperties();
        });
    },
  loadRequestProperties() { 
    const backgroundColor = '#ecf0f1';
    const textColor = '#2c3e50'; 
    const accentColor = '#3498db'; 

    this.customTheme = EditorView.theme({
      "&": {
        color: textColor,
        backgroundColor: backgroundColor
      },
      ".cm-content": {
        caretColor: accentColor
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: accentColor
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: accentColor
      },
      ".cm-gutters": {
        backgroundColor: '#bdc3c7', // A lighter grey for the gutters, softer than the main background
        color: '#7f8c8d', // A mid-tone grey that is easily readable on the lighter gutter background
        border: `1px solid #bdc3c7`
      },
      ".cm-activeLine": {
        backgroundColor: '#dfe6e9' // A very light grey for the active line to subtly distinguish it
      },
      ".cm-matchingBracket, .cm-nonmatchingBracket": {
        backgroundColor: '#bdc3c7', // A light grey for matching brackets background
        color: textColor
      }
    }, { dark: false });

    const judge0LanguageCodes = new Map([
    ['C++', 52],
    ['Python', 71],
    ['JavaScript', 63],
    ['Java', 62],
    ['C#', 51],
    ['Ruby', 72],
    ['Go', 60],
    ['Swift', 83],
    ['Rust', 73],
    ['TypeScript', 74],
    ['C (Clang)', 76],
    ]);
    this.language_id = judge0LanguageCodes.get(this.Language);
    this.getLanguageExtension(this.Language);
  },
  // MOST REPETIIVE CODE EVER I COULD NOT GET IT TO WORK OTHERWISE 
  getLanguageExtension(language) {
      switch (language) {
        case 'C++':
        this.extensions = [cpp(), this.customTheme, EditorView.theme({
          '&': {
            height: '60vh', 
            overflow: 'auto', 
          }
        })];
        break;
        case 'Python':
        this.extensions = [python(), this.customTheme, EditorView.theme({
          '&': {
            height: '60vh', 
            overflow: 'auto', 
          }
        })];
        break;
        case 'JavaScript':
        this.extensions = [javascript(), this.customTheme, EditorView.theme({
          '&': {
            height: '60vh', 
            overflow: 'auto', 
          }
        })];
        break;
        case 'Java':
        this.extensions = [java(), this.customTheme, EditorView.theme({
          '&': {
            height: '60vh', 
            overflow: 'auto', 
          }
        })];
        break;
        case 'C#':
        this.extensions = [cpp(), this.customTheme, EditorView.theme({
          '&': {
            height: '60vh', 
            overflow: 'auto', 
          }
        })];          
        break;
        case 'Ruby':
          // no ruby mode in codemirror 6
          return null;
        case 'Go':
          // no go mode in codemirror 6
          return null; 
        case 'Swift':
          // no swift mode in codemirror 6
          return null;
        case 'Rust':
          this.extensions = [rust(), this.customTheme, EditorView.theme({
            '&': {
              height: '60vh', 
              overflow: 'auto', 
            }
          })];
          break;
        case 'TypeScript':
          // no typescript mode in codemirror 6
          return null; 
        case 'C (Clang)':
        this.extensions = [cpp(), this.customTheme, EditorView.theme({
          '&': {
            height: '60vh', 
            overflow: 'auto', 
          }
        })];
        break;
        default:
          return python();
      }
    },
  },
};

</script>

<style scoped>
.editor-and-button-container h1 {
  color: #3a5a78; /* Match the color with .selected-question h1 */
  font-size: 1.4em; /* Match the font size with .selected-question h1 */
  margin-bottom: 10px; /* Adjust to match .selected-question h1 */
  font-family: 'Arial', sans-serif;

}
.coding-container {
  display: flex;
  height: 87vh;
  gap: 1em;
}

.problem-container h1 {
  color: #3a5a78; /* Match the color with .selected-question h1 */
  font-size: 1.4em; /* Match the font size with .selected-question h1 */
  margin-bottom: 10px; /* Adjust to match .selected-question h1 */
}

.problem-container h2 {
  color: #4a76a8; /* Match the color with .selected-question h2 */
  font-size: 1.2em; /* Match the font size with .selected-question h2 */
  margin-bottom: 10px; /* Adjust to match .selected-question h2 */
}

.problem-container {
  text-align: left;
  font-family: 'Arial', sans-serif;
  color: #333;
  flex: 0.3;
  margin: 20px;
  padding: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Inset shadow for depth */
  border-radius: 10px;
  background-color: #f9f9f9;
}

.problem-container div {
  background-color: #d0d9e6;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', Courier, monospace; /* Monospaced font for code */
  white-space: pre-wrap; /* Preserve whitespace and formatting */
}


.editor-and-button-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}


.code-editor {
  flex-grow: 1;
  border: none;
}

.btn {
  padding: 15px 30px;
  font-size: 1.1em;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn:hover {
  background-color: #3a5a78;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.output-container {
  flex: 1;
  background-color: #e6eef8;
  padding: 1em;
  border-radius: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.output {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #ecf0f1;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .coding-container {
    flex-direction: column;
  }

  .editor-and-button-container {
    order: -1; /* Bring the editor and button on top on smaller screens */
  }
}
</style>