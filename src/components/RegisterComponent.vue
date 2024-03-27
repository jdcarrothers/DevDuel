<template>
  <div class="container">

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

      <div class="divider">
          <span>OR</span>
        </div>

      <div class="otherSignInMethods">
          <button @click="signUpWithGoogle" class="provider-button">
          <svg height="100%" viewBox="0 0 20 20" width="100%" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"></path><path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"></path><path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"></path><path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"></path></svg>
          <span>Continue with Google</span>
          </button>
           
          
          <button @click="signUpWithGithub" class="provider-button">
          <img _ngcontent-ng-c618043916="" fireschemeimage="" alt="" class="provider-icon ng-star-inserted" src="//www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_github.svg">
          <span>Continue with Github</span>
          </button>

          <button @click="signUpWithTwiiter" class="provider-button">
            <svg height="100%" viewBox="0 0 20 20" width="100%" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M20 3.924a8.212 8.212 0 01-2.357.646 4.111 4.111 0 001.804-2.27c-.792.47-1.67.812-2.605.996A4.103 4.103 0 009.85 7.038a11.645 11.645 0 01-8.458-4.287 4.118 4.118 0 00-.555 2.066 4.1 4.1 0 001.825 3.415 4.074 4.074 0 01-1.858-.513v.052a4.105 4.105 0 003.29 4.022 4.01 4.01 0 01-1.852.072 4.106 4.106 0 003.833 2.85A8.268 8.268 0 010 16.411a11.602 11.602 0 006.29 1.846c7.547 0 11.674-6.253 11.674-11.675 0-.18-.004-.355-.01-.53.8-.58 1.496-1.3 2.046-2.125" fill="#55ACEE" fill-rule="evenodd"></path></svg>
            <span>Continue with Twitter</span>
          </button>
      </div>


      <div class="honeypot">
        <input type="text">
      </div>

    </div>
</div>

</template>

<script>
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup,
   GithubAuthProvider, getAuth,
    createUserWithEmailAndPassword,
  TwitterAuthProvider } from "firebase/auth";

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
    //external proivders login--------------------------------
    async signUpWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        const user = result.user;
        const uid = user.uid;
        console.log(uid);
        localStorage.setItem("uid", uid);
        this.$router.push("/home");
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        } else {
          alert('Error during sign up with Google.');
        }
      }
    },
    async signUpWithGithub() {
      try {
        const provider = new GithubAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        const user = result.user;
        const uid = user.uid;
        console.log(uid);
        localStorage.setItem("uid", uid);
        this.$router.push("/home");
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        } else {
          alert('Error during sign up with Github.');
        }
      }
    },
    async signUpWithTwiiter() {
      try {
        const provider = new TwitterAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        const user = result.user;
        const uid = user.uid;
        console.log(uid);
        localStorage.setItem("uid", uid);
        this.$router.push("/home");
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        } else {
          alert('Error during sign up with Twitter.');
        }
      }
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
        if (error.code === "auth/email-already-in-use") {
          alert('Error, email already in use.');
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
.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider:before,
.divider:after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%; /* Adjust based on preference */
  height: 1px;
  background-color: #DDE0E4;
}

.divider:before {
  left: 5%;
}

.divider:after {
  right: 5%;
}

.divider span {
  background-color: #fff; /* Assuming white background; adjust as necessary */
  padding: 0 10px;
  position: relative;
  z-index: 1;
}
.otherSignInMethods {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; 
}

.provider-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px; 
  width: 100%;
  max-width: 250px;
  background-color: #ffffff;
  color: #757575; 
  border: 2px solid #DDE0E4; 
  border-radius: 5px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  cursor: pointer;
  transition: all 0.3s ease; 
  text-decoration: none;
}

.provider-button:hover, .provider-button:focus {
  background-color: #f5f5f5; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  outline: none; 
}

.provider-button svg, .provider-button img {
  width: 20px; 
  height: 20px;
  margin-right: 10px; 
}

.provider-button span {
  font-size: 14px; 
  font-weight: 500;
  color: #5F6368; 
  font-family: 'Roboto', sans-serif; 
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
