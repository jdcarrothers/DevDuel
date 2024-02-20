<template>
  <div class="container-main">
    <div class="user-stats-container">
      <h1 class="stats-header">Welcome Back, {{ this.user.username }}!</h1>

      <div class="personal-message">
        <p>Here's a quick overview of your progress. Keep up the great work!</p>
      </div>

      <div class="gauge-container">
        <label for="codeRatingGauge" class="gauge-label">Your average code rating:</label>
        <div class="gauge">
          <div class="gauge-fill" :style="{ 'width': gaugeWidth, 'background': gaugeColor }"></div>
          <span class="gauge-percentage">{{ this.user.codeRating }}%</span>
        </div>
      </div>

      <div class="stats-group">
        <div class="stat-item">
          <label class="stat-label">Games Played:</label>
          <div class="stat-value">{{ this.user.gamesPlayed }}</div>
        </div>
        <div class="stat-item">
          <label class="stat-label">Wins:</label>
          <div class="stat-value">{{ this.user.Wins }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MainMenu",
  mounted() {
    this.user.username = localStorage.getItem("username");
    this.populateStatistics();
  },
  data() {
    return {
      user: {
        username: "",
        codeRating: 0,
        gamesPlayed: 0,
        Wins: 0,
      },
    };
  },
    computed: {
    gaugeWidth() {
      return `${this.user.codeRating}%`;
    },
    gaugeColor() {
      if (this.user.codeRating < 20) {
        return '#ff0000'; 
      } else if (this.user.codeRating < 40) {
        return '#ff4500'; 
      } else if (this.user.codeRating < 60) {
        return '#ffd700'; 
      } else if (this.user.codeRating < 80) {
        return '#9acd32';
      } else {
        return '#008000'; 
      }
    }
  },
  methods: {
    async populateStatistics() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_SERVER_IP}/requestStatsForMainMenu`,
          { username: this.user.username }
        );
        if (response.data.message === 'User stats retrieved') {
          const userStats = response.data.stats.userStats; 
          this.user.codeRating = userStats.codeRating;
          this.user.gamesPlayed = userStats.gamesPlayed;
          this.user.Wins = userStats.Wins;
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
  },
};
</script>

<style scoped>
.container-main {
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin: 0 20px;
}

.user-stats-container {
  text-align: center;
  font-family: 'Arial', sans-serif;
  color: #333;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); 
  border-radius: 10px;
  background-color: #f9f9f9;
  width: 100%;
  border: 1px solid #d0d9e6;
}

.stats-header {
  color: #3a5a78;
  margin-bottom: 10px;
}

.personal-message p {
  font-style: italic;
  color: #4a76a8;
  margin-bottom: 20px;
}

.gauge-container {
  margin: 20px 0;
  padding: 10px;
  background-color: #e6eef8;
  border-radius: 10px;
  box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3);
}

.gauge {
  width: 80%;
  height: 20px;
  background-color: #d0d9e6;
  border-radius: 10px;
  margin: 10px auto;
  position: relative;
  overflow: hidden; 
}

.gauge-fill {
  height: 100%;
  border-radius: inherit; 
  transition: width 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-label {
  color: #45524b;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.gauge-percentage {
  color: #ffffff;
  font-weight: bold;
  position: absolute;
  width: 100%;
  text-align: center;
}

.stats-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

.stat-item {
  margin: 20px;
}

.stat-label {
  color: #45524b;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.stat-value {
  color: #4a76a8;
  font-weight: bold;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .container-main {
    flex-direction: column;
  }

  .stats-group {
    flex-direction: column;
  }
}
</style>

