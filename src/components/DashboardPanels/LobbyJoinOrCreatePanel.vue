<template>
  <div class="panel">
    <p>Choose an option below to join an existing lobby or create a new one.</p>
    <InputComponent :PlaceholderText="'Enter Lobby Code'" v-model="lobbyID" />
    <p>{{ lobbyID }}</p>
    <ButtonComponent @click="connectToGame" :Text="'Join Lobby'" />
    <ButtonComponent @click="hostGame" :Text="'Create Lobby'" />
  </div>
</template>

<script>
import socketio from "socket.io-client";
import InputComponent from "../UI_Components/InputComponent.vue";
import ButtonComponent from "../UI_Components/ButtonComponent.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "LobbyJoinOrCreatePanel",
  components: {
    InputComponent,
    ButtonComponent,
  },
  props: {
    username: String,
  },
  data() {
    return {
      lobbyID: "",
    };
  },
  methods: {
    ...mapActions(["updateLobbyID", "updateUsername"]),

    connectToGame() {
      const joinLobbyRequest = {
        userID: this.username,
        lobbyID: this.lobbyID,
      };
      this.socket.emit("joinLobbyRequest", joinLobbyRequest);
      this.socket.once("lobbyJoinResponse", (success) => {
        if (success) {
          //stores the lobbyID and username in the vuex store, .store/index.js
          //used to prevent tampering & stops lots of calls being made to the server for the username on each page
          this.updateLobbyID(this.lobbyID);
          this.updateUsername(this.username);

          this.$router.push({
            path: `/join/${this.lobbyID}`,
          });
        } else {
          alert(
            "Lobby does not exist - ensure you have entered the correct code \n and your signed in."
          );
        }
      });
    },
    hostGame() {
      this.socket.emit("createLobbyRequest");
      this.socket.once("lobbyCreated", (newLobby) => {
        console.log("New lobby created:", newLobby);
        this.updateLobbyID(newLobby.lobbyCode);
        this.$router.push({
          path: `/host/${newLobby.lobbyCode}`,
        });
      });
    },
  },
  mounted() {
    this.socket = socketio(process.env.VUE_APP_SERVER_URL);
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });
  },
  computed: {
    ...mapState(["lobbyID", "username"]),
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
