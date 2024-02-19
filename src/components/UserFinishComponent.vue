<template>
    <div class="quiz-completion-container">
      <h2 class="completion-heading">You finished the question!</h2>
      <div class="code-rating-section">
        <p>Your code rating:</p>
        <p class="code-rating">{{ codeRating }}%</p>
      </div>
      <div class="code-reasoning-section">
        <p>Feedback on your code:</p>
        <p class="code-reasoning">{{ codeReasoning }}</p>
      </div>
    </div>
  </template>
  

<script>
export default {
  name: 'UserFinishComponent',
  data() {
    return {
        username: "",
        codeRating: null,
        CodeReasoning: "",
    };
    },
    mounted() {
        this.username = this.$route.query.username || this.$route.params.username;
        this.codeRating = this.$route.query.codeRating || this.$route.params.codeRating;
        this.codeReasoning = this.$route.query.codeReasoning || this.$route.params.codeReasoning;
    },
};
</script>

<style scoped>
.quiz-completion-container {
  font-family: 'Arial', sans-serif;
  color: #333;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9;
  margin: 20px auto;
  text-align: center;
  max-width: 600px;
}

.completion-heading {
  color: #2f5683;
  margin-bottom: 20px;
}

.code-rating-section, .code-reasoning-section {
  margin: 10px 0;
}

.code-rating {
  font-weight: bold;
  font-size: 1.4em;
  color: #2f5683;
}

.code-reasoning {
  font-style: italic;
  color: #45524b;
}
</style>
