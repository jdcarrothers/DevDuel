<template>
  <div class="wrapper">
    <form @submit.prevent="validateForm" class="login-form">
      <h1>Register</h1>
      <div class="input-box">
        <input v-model="email"  id="email" placeholder="Email" required>
      </div>
      <div class="input-box">
        <input 
        required
        @input="checkPasswordStrength"
        placeholder="Enter Password"
        :type="showPassword ? 'text' : 'password'"
        v-model="password">
        <img :src="showPassword ? require('@/assets/eye-open.png') : require('@/assets/eye-closed.png')" class="eyeImg" @click="toggleShowPass">
      </div>
      <div class="line-box">
          <div class="line" :style="{ width: passwordStrengthBarWidth + '%', backgroundColor: passwordStrengthBarColor }"></div>
        </div>
        <div class="password-strength-box">
          <div class="error-container">
            <div class="error-message" v-for="tip in tips" :key="tip">{{ tip }}</div>
          </div>
        </div>
      <button type="submit" class="btn"  >
        <span >Continue</span>
      </button>
      <div class="register-link">
        <p>Have an account? <a href="#" @click="goToLogin">Login</a></p>
      </div>
    </form>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default {
  data() {
    return {
      email: "",
      password: "",
      errors: {}, 
      passwordStrengthTips: '',
      showPassword: false,
      validPassword: false,
      tips: [],
    };
  },
  methods: {
    validateForm() {
      console.log("!")
      this.errors = {}; 
      let isValid = false;
      if(this.validPassword === false) {
        this.errors.password = "Password is not strong enough.";
        isValid = false;
        console.log(isValid)
      }
      else {
        this.errors.password = "";
        isValid = true;
      }
      console.log(isValid)
      if (isValid) {
        this.addUser();
      }
    },
    toggleShowPass() {
      this.showPassword = !this.showPassword;
    },
    checkPasswordStrength() {
      if (!this.password) {
        this.tips = [];
        this.passwordStrengthBarColor = "transparent";
        this.passwordStrengthBarWidth = 0;
        return; // Stop further execution
      }
      this.tips = [];
      let strength = 0;
      const conditions = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*]/];
      if (!/.{8,}/.test(this.password)) this.tips.push("Use at least 8 characters.");
      if (!/[A-Z]/.test(this.password)) this.tips.push("Include an uppercase letter.");
      if (!/[a-z]/.test(this.password)) this.tips.push("Include a lowercase letter.");
      if (!/[0-9]/.test(this.password)) this.tips.push("Include a number.");
      if (!/[!@#$%^&*]/.test(this.password)) this.tips.push("Include a special character");
      conditions.forEach(condition => {
        if (condition.test(this.password)) strength++;
      });
      switch (strength) {
        case 1:
        case 2:
          this.passwordStrengthBarColor = "red";
          this.passwordStrengthBarWidth = 25;
          this.validPassword = false;
          break;
        case 3:
          this.passwordStrengthBarColor = "orange";
          this.passwordStrengthBarWidth = 50;
          this.validPassword = false;
          break;
        case 4:
          this.passwordStrengthBarColor = "lightgreen";
          this.passwordStrengthBarWidth = 75;
          this.validPassword = true;
          break;
        case 5:
          this.passwordStrengthBarColor = "green";
          this.passwordStrengthBarWidth = 100;
          this.validPassword = true;
          break;
        default:
          this.passwordStrengthBarColor = "#d3d3d3";
          this.passwordStrengthBarWidth = 0;
          this.validPassword = false;
      }
    },
    async addUser() {
      console.log("aduser activated")
      createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        console.log(uid);
        localStorage.setItem("uid", uid);
        console.log(userCredential);
        this.$router.push("/home");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          alert('Error, ensure a valid email was entered.');
        }
      });
    },
    goToLogin() {
      this.$router.push("/signin");
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
.password-strength-box {
  margin-top: 15px;
  min-height: 60px;
  display: flex;
}
.password-tips {
  color: #6c757d;
  font-size: 0.9em;
  margin-top: 5px;
  margin-bottom: 30px;
  overflow-wrap: break-word;
  opacity: 0; /* make it invisible by default */
  transition: opacity 0.5s ease-in-out; /* smooth transition for opacity change */
}

.line {
  height: 5px;
  margin-top:-15px;
  border-radius: 5px;
  transition: width 0.5s ease, background-color 0.5s ease;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  scale: 1.2;
  padding-top: 10%;
}

.login-form {
  padding: 40px;
  background: linear-gradient(145deg, #FFFFFF, #D6DDE4);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.25);
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  max-width: 360px;
  width: 100%;
}

h1 {
  color: #333; 
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
  border: 1px solid #DDE0E4;
  border-radius: 8px;
  outline: none;
  background-color: #FAFBFC; 
  transition: all 0.3s ease;
}

.input-box input:focus {
  border-color: #007BFF; 
  background-color: #FFFFFF;
}

.input-box i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 15px;
  color: #888888; 
}

.btn {
  width: 100%;
  padding: 15px;
  background-color: #007BFF; 
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3; 
}

.remember-forgot a, .register-link a {
  color: #007BFF; 
  text-decoration: none;
}

.register-link {
  text-align: center;
  margin-top: 24px;
}

.error {
  color: red;
  font-size: 0.8em;
  margin-top: -15px;
  margin-bottom: 10px;
}

.error-container {
  display: grid;
  padding-left: 15px;
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
  grid-template-rows: auto auto; /* rows based on content */
  gap: 10px; /* Adjust gap as needed */
  margin-top: 0px;
  margin-bottom:10px;
}

.error-message {
  color: #6c757d; /* A neutral, informative color */
  font-size: 0.75em;
  margin-top: 5px;
}

.eyeImg {
  position: absolute;
  right: 10px; 
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 25px; 
  height: 25px;
}
.honeypot{
  opacity: 0;
}

</style>
