<template>
<div class="wrapper">
  <form @submit.prevent="login" class="login-form">
    <h1>Login</h1>
    <div class="input-box">
      <input v-model="user.username" type="text" placeholder="Username" required>
    </div>
    <div class="input-box">
      <input v-model="user.password" :type="showPassword ? 'text' : 'password'" placeholder="Password" required>
    </div>
    <div class="error-message" :class="{ 'active': feedbackMessage }">
      {{ feedbackMessage }}
    </div>
    <div class="checkbox-container">
      <input type="checkbox" v-model="showPassword" id="show-password-checkbox">
      <label for="show-password-checkbox">Show Password</label>
    </div>
    <div class="remember-forgot">
      <a href="#">Forgot Password?</a>
    </div>
    <button type="submit" class="btn" :disabled="isLoading">
      <span v-if="!isLoading">Login</span>
      <span v-else class="spinner"></span>
    </button>
    <div class="register-link">
      <p>Don't have an account? <a href="#" @click.prevent="goToRegister">Register</a></p>
    </div>
  </form>
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      showPassword: false,
      feedbackMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_SERVER_IP}/login`, this.user);
        if (response.status === 200) {
          localStorage.setItem('username', this.user.username);
          this.$router.push('/home');
        }
      } catch (error) {
        this.feedbackMessage = error.response && error.response.data.message ? error.response.data.message : 'Login failed';
      } finally {
        this.isLoading = false;
      }
    },
    goToHome() {
      this.$router.push('/home');
    },
    goToRegister() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body, html {
  height: 100%;
  background-color: #F0F2F5; /* Updated background for a slight texture */
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  padding: 40px;
  background: linear-gradient(145deg, #FFFFFF, #F0F2F5); /* Subtle gradient for form background */
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
}

h1 {
  color: #333; /* Dark text for better contrast */
  margin-bottom: 30px;
  text-align: center;
  font-size: 24px;
}

.input-box {
  position: relative;
  margin-bottom: 30px;
}

.input-box input {
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #DDE0E4; /* Softer border */
  border-radius: 8px;
  outline: none;
  background-color: #FAFBFC; /* Lighter input background */
  transition: all 0.3s ease;
}

.input-box input:focus {
  border-color: #007BFF; /* Focus highlight */
  background-color: #FFFFFF;
}

.input-box i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 15px;
  color: #888888; /* Icon color */
}

.btn {
  width: 100%;
  padding: 15px;
  background-color: #007BFF; /* Primary button color */
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3; /* Darker on hover */
}

.remember-forgot a, .register-link a {
  color: #007BFF; /* Link color */
  text-decoration: none;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.register-link {
  text-align: center;
  margin-top: 24px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.error-message {
  color: #ff3860; /* Red for errors */
  background-color: #ffebee;
  padding: 10px;
  margin-top: 0px;
  margin-bottom: 20px;
  border-radius: 5px;
  transition: opacity 0.5s, transform 0.5s;
  opacity: 0;
  transform: translateY(-20px); /* Adjust as needed */
  visibility: hidden;
  max-height: 0; /* Remove if not using max-height transition */
  overflow: hidden;
}

.error-message.active {
  opacity: 1;
  transform: translateY(0px);
  visibility: visible;
  max-height: 50px; /* Adjust based on the content size, remove if not using */
}

</style>
