<template>
  <div class="container">

    <p>Connect to a game by entering the game ID and your name. Host a game by clicking the host button.</p>

    <div class="connect">
      <input type="text" placeholder="Input ID">
      <input type="text" placeholder="Input Name">
      <button @click="connectToGame">Connect</button>
    </div>

    <p>OR</p>

    <div class="host">
      <button @click="hostGame">Host</button>
    </div>
  </div>
</template>

<script>
import socketio from 'socket.io-client';

export default {
  data() {
    return {
      socket: null
      
    };
  },
  conputed: {
    possy() {
      return this.$route.params.lobbyCode;
    }
  },
  mounted() {
    this.socket = socketio('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
  },
  methods: {
    connectToGame() {
      console.log('Connecting to game...');
    },
    hostGame() {
      console.log('Hosting game...');
      this.socket.emit('createLobbyRequest');
      this.socket.once('lobbyCreated', (lobbyCode) => {
      console.log(lobbyCode);
      this.$router.push({ path: `/lobby/${lobbyCode}` });
      });
    }
  }
};
</script>

<style scoped>
.connect {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh;
  width: 50vh;
  background-color: rgb(69, 74, 83);
  color:  #ffffff;
}
</style>
