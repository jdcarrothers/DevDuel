<template>
  <div class="panel">
    <header class="panel-header">
      <h1>Join or Create Lobby</h1>
      <p>
        Select an option to proceed with either joining an existing lobby or creating a
        new one.
      </p>
    </header>
    <section class="input-section">
      <InputComponent :PlaceholderText="'Enter Lobby Code'" v-model="lobbyID" />
    </section>
    <section class="button-section">
      <div class="btn1">
        <ButtonComponent @click="connectToGame" :Text="'Join Lobby'" />
      </div>
      <div class="btn2">
        <ButtonComponent @click="hostGame" :Text="'Create Lobby'" />
      </div>
    </section>
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
      if (this.lobbyID === "") {
        alert("Please enter a lobby code");
        return;
      } else if (this.username === "") {
        alert("Please sign in to join a lobby");
        return;
      }
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
  font-family: "Arial", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  color: #333;
  text-align: center;
  padding: 20px;
  max-width: 320px;
}

.panel-header {
  margin-bottom: 20px;
}

.input-section,
.button-section {
  width: 100%;
  margin: 10px 0;
}
.btn2 {
  margin-top: 15px;
}
</style>
