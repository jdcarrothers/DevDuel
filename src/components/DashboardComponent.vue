<template>
<div class="container">
    <div class="dashboard">
    
      <div class="dashboard-item forename ">
        <h1>Welcome Back {{ this.forename }}</h1>
        <p>Ready for your next duel? Jump in!</p>
      </div>
      
      <div class="dashboard-item joinOrCreateMenu ">
        <h1>Start or Join a Lobby</h1>
        <button class="btn">Create Lobby</button>
        <p>or enter code to</p>
        <input type="text" placeholder="Enter Lobby Code">
        <button class="btn">Join Lobby</button>
      </div>

      <div class="dashboard-item codeRating">
        <div class="inner-container"> 
          <div class="code-rating">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                stroke-width="2.8" />

              <path class="circle"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                :stroke="ratingColor"
                stroke-width="2.8"
                :stroke-dasharray="circumference + ' ' + circumference"
                stroke-dashoffset="circumference"
                ref="circle" />
              <text x="18" y="20.35" class="percentage" dominant-baseline="middle" text-anchor="middle">{{ codeRating }}%</text>
            </svg>
          </div>
          <div class="code-rating-explanation">
            <h1>Your Code Rating</h1>
            <p>Strive for improvement, one line at a time!</p>
          </div>
        </div>
      </div>  

      <div class="dashboard-item gamesPlayed ">
        <h1>Games Played: {{ this.gamesPlayed }}</h1>
        <p>Your journey so far is impressive. Keep moving forward!</p>
      </div>

      <div class="dashboard-item badgesSection">
      <h1>Badges Earned</h1>
        <div class="badgesLayout">
          <div v-if="this.isPremium">
            <img :src="require('@/assets/devDuelPremium.png')" class="badge">
          </div>
          <div v-if="this.hasWon">
            <img :src="require('@/assets/devDuelWonAGame.png')" class="badge">
          </div>
          <div v-if="this.tenOrMoreWins">
            <img :src="require('@/assets/devDuelWonTenGames.png')" class="badge">
          </div>
        </div>
        <p>{{ this.badgeMessage }}</p>
      </div>
      
      <div class="dashboard-item problemsSolved ">
        <h1>Challenges Overcome: {{ this.problemsSolved }}</h1>
        <p>Every problem solved is a step forward. Keep conquering!</p>
      </div>

      <div class="dashboard-item Wins ">
        <h1>Victories: {{ this.Wins }}</h1>
        <p>Each victory is a testament to your skill. Onward to more!</p>
      </div>
      
      <div class="dashboard-item oneVersus ">
        <h1>Face Off in a Duel</h1>
        <select v-model="selectedLanguage">
          <option value="javascript">JavaScript</option>
          <option value="csharp">C#</option>
          <option value="python">Python</option>
        </select>
        <button class="btn">Challenge Now</button>
      </div>  

    </div>  
</div>
</template>

<script>

export default {
  name: 'DashboardComponent',
  data() {
    return {
      Wins: 10,
      problemsSolved: 0,
      codeRating: 90,
      forename: 'Joshua',
      gamesPlayed: 0,
      username: 'jdcarrothers',
      isPremium: true,
      tenOrMoreWins: false,
      hasWon: false,
      badgeMessage: 'Keep up the great work!',
      loading: false,
      selectedLanguage: 'javascript',
      };
  },
  mounted() {
    this.animateCircle();
    this.boolsForBadges();
  },
  created() {
    // Initialize component
  },
  watch: {
    selectedLanguage(newVal) {
      console.log("Selected programming language: ", newVal);
      // You can perform actions based on the selected language here.
    }
  },
  computed: {
    circumference() {
      return 2 * Math.PI * 15.9155; // Circumference of the circle
    },
    strokeDashoffset() {
      return this.circumference - (this.codeRating / 100) * this.circumference;
    },
    ratingColor() {
      if (this.codeRating < 20) {
        return '#ff0000'; 
      } else if (this.codeRating < 40) {
        return '#ff4500'; 
      } else if (this.codeRating < 60) {
        return '#ffd700'; 
      } else if (this.codeRating < 80) {
        return '#9acd32';
      } else {
        return '#008000'; 
      }
    },
  },
  methods: {
      animateCircle() {
        requestAnimationFrame(() => {
          this.$refs.circle.style['stroke-dashoffset'] = this.strokeDashoffset;
        });
      },
      boolsForBadges() {
          this.tenOrMoreWins = this.Wins >= 10;
          this.hasWon = this.Wins > 0;
          if (!this.isPremium && this.Wins === 0) {
            this.badgeMessage = 'Get your first badge by winning your first game!';
          }
      },
    }
};
</script>

<style scoped>
.inner-container {
  display: flex;
  flex-direction: row;
  justify-content: center; /* Horizontally center the flex items */
  align-items: center; /* Vertically center the flex items */
  width: 100%; /* Take up the full width of the parent container */
}
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Maintain the grid but ensure spacing and padding are consistent */
  grid-gap: 20px; /* Adjust based on your design preference */
  padding: 20px; /* Padding around the grid for spacing */
  font-family: Arial, sans-serif; /* Ensure consistent font family */
}

.dashboard-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #FAFBFC;
  border: 1px solid #DDE0E4;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 18px;
}

h1 {
  color: #333;
  font-size: 24px; /* Consistent font size for headings */
  text-align: center; /* Center headings */
}

p, select, input, button, a { /* Apply consistent font styling */
  font-size: 18px; /* Standard font size for text elements */
  color: #757575; /* Subdued text color for readability */
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
  padding-left: 0.5%  

}
/* Adjustments for responsiveness */
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

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
}

.circle {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 1.32s ease;
}

.percentage {
  fill: #333;
  font-family: sans-serif;
  font-size: 0.5em;
  text-anchor: middle;
}

.code-rating {
  display: flex;
  align-items: center; /* Center the content vertically */
  justify-content: center; /* Center the content horizontally */
}
.code-rating text {
  font-weight: bold;
}
.code-rating svg {
  height: 1000px; /* Example height for the SVG */
}
.code-rating-explanation {
  text-align: center; /* Center the text */
  padding-left:20px;
}
.codeRating{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #FAFBFC;
  border: 1px solid #DDE0E4;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 18px;
}
.badge {
  width: 120px;
  height: 120px;
  margin-top: 10px;
}
.badgesLayout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
}
</style>
