<template>
<div class="container">
    <div class="dashboard">
      <div class="dashboard-item forename ">
        <WelcomePanel :username="username" :profileImg="profileImg" />
      </div>
      
      <!-- <div class="dashboard-item joinOrCreateMenu ">
        <h1>Start or Join a Lobby</h1>
        <button class="btn">Create Lobby</button>
        <p>or enter code to</p>
        <input type="text" placeholder="Enter Lobby Code">
        <button class="btn">Join Lobby</button>
      </div> -->

      <div class="dashboard-item codeRating">
        <CodeRatingPanel :codeRating="codeRating" />
      </div>  

      <!-- <div class="dashboard-item gamesPlayed ">
        <h1>Games Played: {{ this.gamesPlayed }}</h1>
        <p>Your journey so far is impressive. Keep moving forward!</p>
      </div> -->

      <div class="dashboard-item badgesSection">
        <BadgesPanel :isPremium="isPremium" :Wins="Wins" />
      </div>
      
      <!-- <div class="dashboard-item problemsSolved ">
        <h1>Challenges Overcome: {{ this.problemsSolved }}</h1>
        <p>Every problem solved is a step forward. Keep conquering!</p>
      </div> -->

      <!-- <div class="dashboard-item Wins ">
        <h1>Victories: {{ this.Wins }}</h1>
        <p>Each victory is a testament to your skill. Onward to more!</p>
      </div> -->
      
      <!-- <div class="dashboard-item oneVersus ">
        <h1>Face Off in a Duel</h1>
        <select v-model="selectedLanguage">
          <option value="javascript">JavaScript</option>
          <option value="csharp">C#</option>
          <option value="python">Python</option>
        </select>
        <button class="btn">Challenge Now</button>
      </div>   -->
    </div>  
</div>
</template>

<script>
import CodeRatingPanel from './DashboardPanels/CodeRatingPanel.vue';
import BadgesPanel from './DashboardPanels/BadgesPanel.vue';
import WelcomePanel from './DashboardPanels/WelcomePanel.vue';
export default {
  name: 'DashboardComponent',
  data() {
    return {
      
      };
  },
  components: {
    CodeRatingPanel,
    BadgesPanel,
    WelcomePanel,
  },
  mounted() {
    this.boolsForBadges();
  },
  watch: {
    selectedLanguage(newVal) {
      console.log("Selected programming language: ", newVal);
    }
  },
  methods: {
      boolsForBadges() {
          this.tenOrMoreWins = this.Wins >= 10;
          this.hasWon = this.Wins > 0;
      },
    }
};
</script>

<style scoped>
.dashboard {
  font-family: Arial, sans-serif; /* Ensure consistent font family */
  scale: 0.8;
}

h1 {
  color: #333;
  font-size: 24px;
}

p, select, input, button{ 
  font-size: 18px; 
  color: #757575; 
}

.btn {
  padding: 15px;
  background-color: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center; /* Ensure text is centered */
  display: block; /* Make the button block level for full width */
  width: 100%; /* Full width buttons */
  margin-top: 10px; /* Space above buttons */
  font-size: 16px; /* Slightly larger font size for button text */
}

.btn:hover {
  background-color: #0056b3;
}

select, input {
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #DDE0E4;
  background-color: #FAFBFC;
  outline: none;
  width: 100%; /* Ensure select fills its container */
  box-sizing: border-box; /* Ensure padding doesn't increase the size */
  margin-top: 10px; /* Space above the select */
  font-size: 14px; /* Consistent font size */
}
.container{
  padding-top: 2%;
  padding-left: 2% ;
  padding-bottom: 2%;
  background-color: #000000;
}
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr); /* Adjust to 2 columns on medium screens */
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr; /* Single column layout for small screens */
  }
}

.input-box input:focus, select:focus {
  border-color: #007BFF; /* Focus state border color for inputs and select */
  background-color: #FFFFFF; /* White background on focus for contrast */
}
</style>
