<template>
  <div class="container">
    <div class="dashboard">
      <div class="dashboard-item welcomePanel">
        <WelcomePanel
          :username="username"
          :profileImg="profileImg"
          :loginStreak="loginStreak"
          :gamesPlayed="gamesPlayed"
          :problemsSolved="problemsSolved"
          :duelsWon="duelsWon"
          :duelsLost="duelsLost"
          :lobbyWins="Wins"
        />
      </div>

      <div class="row-container">
        <div class="left-container">
          <div class="codeRatingPanel">
            <CodeRatingPanel :codeRating="codeRating" />
          </div>
          <div class="badgesPanel">
            <BadgesPanel :isPremium="isPremium" :Wins="Wins" />
          </div>
        </div>

        <!-- <div class="center-container">
          <div class="friendsPanel">
            <FriendsPanel />
          </div>
        </div> -->

        <div class="right-container">
          <div class="lobbyJoinOrCreatePanel">
            <LobbyJoinOrCreatePanel :username="username" />
          </div>

          <!-- <div class="oneVersus">
            <h1>Face Off in a Duel</h1>
            <select v-model="selectedLanguage">
              <option value="javascript">JavaScript</option>
              <option value="csharp">C#</option>
              <option value="python">Python</option>
            </select>
            <button class="btn">Challenge Now</button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeRatingPanel from "./DashboardPanels/CodeRatingPanel.vue";
import BadgesPanel from "./DashboardPanels/BadgesPanel.vue";
import WelcomePanel from "./DashboardPanels/WelcomePanel.vue";
import LobbyJoinOrCreatePanel from "./DashboardPanels/LobbyJoinOrCreatePanel.vue";
// import FriendsPanel from "./DashboardPanels/FriendsPanel.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export default {
  name: "DashboardComponent",
  data() {
    return {
      Wins: null,
      problemsSolved: null,
      codeRating: null,
      forename: null,
      gamesPlayed: null,
      username: null,
      isPremium: false,
      duelsWon: null,
      duelsLost: null,
      profileImg: null,
      loading: true,
      selectedLanguage: "javascript",
    };
  },
  components: {
    CodeRatingPanel,
    BadgesPanel,
    WelcomePanel,
    LobbyJoinOrCreatePanel,
    // FriendsPanel,
  },
  mounted() {
    this.fetchUserData();
  },
  watch: {
    selectedLanguage(newVal) {
      console.log("Selected programming language: ", newVal);
    },
  },
  methods: {
    async fetchUserData() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const uid = user.uid;
            console.log("User is signed in with uid:", uid);
            const res = await axios.post(
              `${process.env.VUE_APP_SERVER_IP}/api/fetchUserData`,
              {
                uid,
              }
            );
            console.log("User data fetched:", res.data);
            this.updateUserData(res.data);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          console.log("No user is signed in.");
        }
      });
    },
    updateUserData(data) {
      this.Wins = data.Wins;
      this.problemsSolved = data.problemsSolved;
      this.codeRating = data.codeRating;
      this.forename = data.forename;
      this.gamesPlayed = data.gamesPlayed;
      this.username = data.username;
      this.isPremium = data.isPremium;
      this.duelsWon = data.duelsWon;
      this.duelsLost = data.duelsLost;
      this.profileImg = data.profileImg;
    },
  },
};
</script>
<style scoped>
.welcomePanel {
  border-radius: 20px;
  color: #2c3e50;
  transition: all 0.3s ease;
  margin: 20px;
}

.dashboard {
  padding-left: 10%;
  padding-right: 10%;
}
.row-container {
  display: flex;
  flex-direction: row;
  margin: 20px;
}
.left-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
@media (max-width: 1024px) {
}

@media (max-width: 768px) {
}
</style>
