<template>
  <div>
    <NavBarComponent />
    <RouterView />
  </div>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';
import socketio from 'socket.io-client';
export default {
  name: 'App',
  components: {
    NavBarComponent
  },
  mounted() {
    },
  methods: {
    initializeSocket() {
        this.socket = socketio(process.env.VUE_APP_SERVER_URL);
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
    },
  }
}

</script>

<style>
</style>
