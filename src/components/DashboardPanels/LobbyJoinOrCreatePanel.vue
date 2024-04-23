<template>
  <div class="panel">
    <p>Choose an option below to join an existing lobby or create a new one.</p>
    <InputComponent :PlaceholderText="'Enter Lobby Code'" v-model="lobbyID" />
    <p>{{ lobbyID }}</p>
    <ButtonComponent @click="connectToGame" :Text="'Join Lobby'" />
    <ButtonComponent :Text="'Create Lobby'" />
  </div>
</template>

<script>
import socketio from "socket.io-client";
import InputComponent from "../UI_Components/InputComponent.vue";
import ButtonComponent from "../UI_Components/ButtonComponent.vue";

export default {
  name: "LobbyJoinOrCreatePanel",
  components: {
    InputComponent,
    ButtonComponent,
  },
  data() {
    return {
      lobbyID: "",
    };
  },
  methods: {
    connectToGame() {
      const joinLobbyRequest = {
        lobbyID: this.lobbyID,
      };
      console.log(joinLobbyRequest);
      this.socket.emit("joinLobbyRequest", joinLobbyRequest);
      this.socket.once("lobbyJoinResponse", (success) => {
        if (success) {
          this.$router.push({
            path: `/join/${this.joinCredLobbyID}`,
          });
        } else {
          alert("Lobby does not exist");
        }
      });
    },
  },
  watch: {},
  mounted() {
    this.socket = socketio(process.env.VUE_APP_SERVER_URL);
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });
  },
};
</script>

<style scoped>
.panel {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  color: #333;
  text-align: center;
  padding: 20px;
  transition: all 0.3s ease;
  max-width: 260px;
}
</style>
