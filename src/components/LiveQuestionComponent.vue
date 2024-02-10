<template>
  <div class="container">
    <div class="buttons">
      <button @click="runCodeAndGetSubmissionToken">Submit code</button>
      <button @click="toggleCodeMirrorMode">Toggle {{ pickedLanguage }}</button>
    </div>
    <div class="editor">
      <div class="problem">
        <h1>The problem:</h1>
        <p>Write a python script that prints the 5 times tables from one to until 25</p>
        <h1>Example output:</h1>
        <p>5</p>
        <p>10</p>
        <p>15</p>
        <p>20</p>
        <p>25</p>
      </div>
      <codemirror ref="myCodeMirror" v-model="code" :extensions="extensions" class="code-editor"/>
      <textarea v-model="codeOutput" class="output"></textarea>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import axios from 'axios';

export default {
  components: {
    Codemirror
  },
  setup() {
    const extensions = ref([javascript(), oneDark, EditorView.theme({
    '&': {
      height: '60vh', // Set the height of the editor
      overflow: 'auto', // Enable scroll
    }
  })]); 
    const possibleLanguages = ['JavaScript', 'Python'];
    const pickedLanguage = ref('JavaScript');
    const i = ref(0);
    let codeOutput = ref('When you run your code, the output will be displayed here.');
    const encodedExpectedOutput = ref('');
    let judgeReply = ''; 

    const code = ref(`console.log('Hello, World!')`);
    const encodedCode = ref('');

    function getLanguageMode(language) {
      switch (language.toLowerCase()) {
        case 'javascript':
          code.value = `console.log('Hello, World!')`;
          return javascript();
        case 'python':
          code.value = `print('Hello, World!')`;
          return python();
        default:
          return javascript(); 
      }
    }

    function toggleCodeMirrorMode() {
      i.value = (i.value + 1) % possibleLanguages.length; 
      pickedLanguage.value = possibleLanguages[i.value];
      extensions.value = [getLanguageMode(pickedLanguage.value), oneDark, EditorView.theme({
    '&': {
      height: '60vh', // Set the height of the editor
      overflow: 'auto', // Enable scroll
    }
  })];
    }
    
    async function getSubmissionTokenData(){
      const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${judgeReply}`,
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

        codeOutput.value = response.data.stdout || response.data.stderr || "No output";

        console.log("Updated codeOutput: ", codeOutput.value);
      } catch (error) {
        console.error(error);
      }
    }

    async function runCodeAndGetSubmissionToken(){
      encodedCode.value = btoa(code.value);
      encodedExpectedOutput.value = btoa(codeOutput.value);

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
          source_code: encodedCode.value,
          stdin: encodedExpectedOutput.value
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data);
        judgeReply = response.data.token;
        getSubmissionTokenData(judgeReply);
      } catch (error) {
        console.error(error);
      }
    }
    return {
      code,
      extensions,
      possibleLanguages,
      pickedLanguage,
      codeOutput,
      toggleCodeMirrorMode,
      runCodeAndGetSubmissionToken,
    };
  },
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
