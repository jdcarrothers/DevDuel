<template>
  <div class="container">
    <h2>Register</h2>
      <div>
        <label for="username" class="input-label">Username</label>
        <input v-model="user.username" type="text" id="username" placeholder="Enter Username" class="input-field" >
      </div>
      <div>
        <label for="email" class="input-label">Email</label>
        <input v-model="user.email" type="email" id="email" placeholder="Enter Email" class="input-field" >
      </div>
      <div>
        <label for="password" class="input-label">Password</label>
        <input v-model="user.password" type="password" id="password" placeholder="Enter Password" class="input-field" >
      </div>
      <button @click="addUser" class="btn">Submit</button>
      <button type="button" @click="goToHome" class="btn">Bypass</button>
      <p class="movement" @click="goToLogin">Click here to sign in</p>
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
        email: ''
      },
    };
  },
  methods: {
    async addUser() {
      try {
        const response = await axios.post('http://172.21.252.211:2000/adduser', this.user);
        alert('User added successfully!');
        console.log(response);
        console.log(this.user);
        localStorage.setItem('username', this.user.username);
        this.goToHome();
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    goToHome() {
      this.$router.push('/home');
    },
    goToLogin() {
      this.$router.push('/signin');
    }
  }
};
</script>

<style scoped>
.container {
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

h2 {
  color: #4a76a8;
  font-size: 2em;
  margin-bottom: 20px;
}
.movement {
  padding-top: 10px;
  color: #4a76a8;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1.1em;
}

.input-label {
  display: block;
  color: #4a76a8;
  margin-bottom: 5px;
  font-size: 1em;
}

.input-field {
  padding: 10px;
  margin-bottom: 20px;
  border: 2px solid #d0d9e6;
  border-radius: 4px;
  width: 80%;
  font-family: 'Arial', sans-serif;
}

.btn {
  background-color: #2f5683;
  color: white;
  padding: 15px 30px;
  font-size: 1.1em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  margin-top: 20px;
}

.btn:hover {
  background-color: #3a5a78;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}


@media (max-width: 768px) {
  .container {
    padding: 20px 10px;
  }

  .input-field, .btn {
    width: 90%;
  }
}
</style>
