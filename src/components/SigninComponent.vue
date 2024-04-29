<template>
  <div class="navbar">
    <div class="logo-container">
      <img :src="require('@/assets/devDuelLogo.png')" class="logo" alt="logo" />
    </div>
  </div>

  <div class="outer-container">
    <div class="container">
      <div class="wrapper">
        <form @submit.prevent="validateForm" class="login-form">
          <h1>Sign In</h1>

          <div class="input-box">
            <input v-model="email" id="email" placeholder="Email" required />
          </div>

          <div class="input-box">
            <input
              required
              placeholder="Enter Password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
            />
            <img
              :src="
                showPassword
                  ? require('@/assets/eye-open.png')
                  : require('@/assets/eye-closed.png')
              "
              class="eyeImg"
              @click="toggleShowPass"
            />
          </div>

          <div class="remember-forgot">
            <a href="#" class="space">Forgot Password?</a>
          </div>

          <button type="submit" class="btn">
            <span>Sign In</span>
          </button>

          <div class="register-link">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        </form>

        <!-- end of wrapper> -->
      </div>
      <div class="vertical-divider"></div>
      <!-- start of socials -->
      <div class="social-signin-section">
        <div class="otherSignInMethods">
          <button @click="signInWithGoogle" class="provider-button">
            <svg
              height="100%"
              viewBox="0 0 20 20"
              width="100%"
              fit=""
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <path
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                fill="#4285F4"
              ></path>
              <path
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                fill="#34A853"
              ></path>
              <path
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                fill="#FBBC05"
              ></path>
              <path
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                fill="#EA4335"
              ></path>
            </svg>
            <span>Sign In with Google</span>
          </button>

          <button @click="signInWithGithub" class="provider-button">
            <img
              _ngcontent-ng-c618043916=""
              fireschemeimage=""
              alt=""
              class="provider-icon ng-star-inserted"
              src="//www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_github.svg"
            />
            <span>Sign In with Github</span>
          </button>

          <button @click="signInWithTwitter" class="provider-button">
            <svg
              height="100%"
              viewBox="0 0 20 20"
              width="100%"
              fit=""
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <path
                d="M20 3.924a8.212 8.212 0 01-2.357.646 4.111 4.111 0 001.804-2.27c-.792.47-1.67.812-2.605.996A4.103 4.103 0 009.85 7.038a11.645 11.645 0 01-8.458-4.287 4.118 4.118 0 00-.555 2.066 4.1 4.1 0 001.825 3.415 4.074 4.074 0 01-1.858-.513v.052a4.105 4.105 0 003.29 4.022 4.01 4.01 0 01-1.852.072 4.106 4.106 0 003.833 2.85A8.268 8.268 0 010 16.411a11.602 11.602 0 006.29 1.846c7.547 0 11.674-6.253 11.674-11.675 0-.18-.004-.355-.01-.53.8-.58 1.496-1.3 2.046-2.125"
                fill="#55ACEE"
                fill-rule="evenodd"
              ></path>
            </svg>
            <span>Sign In with Twitter</span>
          </button>
        </div>
      </div>

      <!-- end of container -->
    </div>
  </div>

  <div class="honeypot">
    <input type="text" v-model="hpot" />
  </div>
</template>

<script>
//read comments of the signup component for the explanation of the code
//very similar
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  getAuth,
  TwitterAuthProvider,
} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

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
      passwordStrengthTips: "",
      showPassword: false,
      validPassword: false,
      tips: [],
      hpot: "",
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          console.log("User is signed in with uid:", uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });
  },
  methods: {
    validateForm() {
      this.errors = {};
      let isValid = false;
      if (this.hpot) {
        console.log("bot detected");
        return;
      }
      if (this.validPassword === false) {
        this.errors.password = "Password is not strong enough.";
        isValid = false;
      } else {
        this.errors.password = "";
        isValid = true;
      }
      if (isValid) {
        this.signInWithEmailAndPassword();
      }
    },
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        this.$router.push("/dashboard");
      } catch (error) {
        this.handleAuthError(error);
      }
    },

    async signInWithGithub() {
      try {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
        this.$router.push("/dashboard");
      } catch (error) {
        this.handleAuthError(error);
      }
    },

    async signInWithTwitter() {
      try {
        const provider = new TwitterAuthProvider();
        await signInWithPopup(auth, provider);
        this.$router.push("/dashboard");
      } catch (error) {
        this.handleAuthError(error);
      }
    },
    handleAuthError(error) {
      alert(error);
    },
    async signInWithEmailAndPassword() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/dashboard");
      } catch (error) {
        this.handleAuthError(error);
      }
    },
    toggleShowPass() {
      this.showPassword = !this.showPassword;
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
.social-signin-section {
  padding-top: 19%;
  min-width: 200px;
}
.vertical-divider {
  position: relative;
  padding: 2.5%;
  padding-left: 7%;
  height: auto;
}
.vertical-divider p {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1;
}
.login-form {
  min-width: 310px;
}

.vertical-divider:before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px; /* Thickness of the line */
  background-color: #dde0e4;
}

.vertical-divider span {
  background-color: #fff; /* Matches the background of your container/wrapper */
  padding: 0 10px;
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
  background-color: #ffffff; /* Start with a clean white base */
  color: #757575;
  border: 2px solid #f0f0f0; /* Lighter border for a softer look */
  border-radius: 10px; /* Slightly increased for a more modern, rounded look */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05); /* Softened shadow for depth without harshness */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for interactions */
  text-decoration: none;
  position: relative; /* Added for the hover effect */
  overflow: hidden; /* Ensure the pseudo-element does not exceed the button bounds */
}

.provider-button:hover,
.provider-button:focus {
  background-color: #ffffff; /* Maintain the white background */
  transform: translateY(-2px); /* Slight lift effect */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Enhanced shadow for lifted effect */
}

.provider-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  ); /* Subtle highlight */
  transition: all 0.4s ease;
  z-index: 0;
}

.provider-button:hover::before,
.provider-button:focus::before {
  left: 100%;
}

.provider-button svg,
.provider-button img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  z-index: 1; /* Ensure icons stay above the pseudo-element */
}

.provider-button span {
  font-size: 14px;
  font-weight: 500;
  color: #5f6368;
  font-family: "Roboto", sans-serif;
  z-index: 1; /* Ensure text stays above the pseudo-element */
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
  margin-top: -15px;
  border-radius: 5px;
  transition: width 0.5s ease, background-color 0.5s ease;
}
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  scale: 1.2;
  padding-top: 12.5%;
}
.container {
  max-width: 600px; /* Max width for inner content */
  width: 100%; /* Ensure it remains responsive */
  background: #ffffff; /* Updated to pure white for a cleaner look */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Softer shadow for a subtle depth */
  border: 1px solid #f0f0f0; /* Lighter border color for subtlety */
  border-radius: 12px; /* Retained border radius for a smooth appearance */
  padding: 20px; /* Retained padding for internal spacing */
  display: flex;
  flex-direction: row; /* Retained layout style */
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
  border: 1px solid #dde0e4;
  border-radius: 8px;
  outline: none;
  background-color: #fafbfc;
  transition: all 0.3s ease;
}

.input-box input:focus {
  border-color: #007bff;
  background-color: #ffffff;
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
  background-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link {
  text-align: center;
  margin-top: 24px;
}
.remember-forgot {
  min-height: 50px;
}
.remember-forgot a {
  padding-top: -10px;
  color: #007bff;
  text-decoration: none;
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
  margin-bottom: 10px;
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
.honeypot {
  opacity: 0;
}

.navbar {
  width: 100%;
  background-color: #fff; /* Adjust if you have a specific color theme */
  padding: 10px 0; /* Adjust based on the size of your logo and navbar height preference */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for a slight elevation effect */
  position: fixed; /* Keeps the navbar at the top */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensures navbar stays above other content */
}

.logo-container {
  width: 100%; /* Ensures the logo container spans the full navbar width */
  display: flex;
  justify-content: center; /* Centers the logo horizontally */
  align-items: center; /* Centers the logo vertically */
}

.logo {
  height: 75px; /* Adjust based on your logo's size for a balanced look */
  /* Add any additional styling needed for your logo */
}
.space {
  margin-left: 5px;
}
</style>
