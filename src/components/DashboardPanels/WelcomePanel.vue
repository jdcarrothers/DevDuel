<template>
  <div class="inner-container">
    <img :src="profileImg" alt="Profile Image" class="profile-image" />
    <div class="welcome-message">
      <h1>
        Welcome Back,
        <a href="/profile">{{ username }}!</a>
      </h1>
      <p>Let's sharpen your coding skills!</p>
    </div>
    <div class="stats">
      <div class="stat-item">
        <p>Games Played: {{ gamesPlayed }}</p>
      </div>
      <div class="stat-item">
        <p>Problems Solved: {{ problemsSolved }}</p>
      </div>
      <div class="stat-item">
        <p>Lobby Wins: {{ lobbyWins }}</p>
      </div>
      <div class="stat-item">
        <p>Duels Won: {{ duelsWon }}</p>
      </div>
      <div class="stat-item">
        <p>Duels Lost: {{ duelsLost }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomePanel",
  props: {
    username: String,
    profileImg: String,
    gamesPlayed: Number,
    problemsSolved: Number,
    lobbyWins: Number,
    duelsWon: Number,
    duelsLost: Number,
  },
  methods: {},
};
</script>

<style scoped>
.inner-container {
  font-family: Arial, sans-serif; /* Set the font family for all child components */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  color: #333;
  max-width: 1500px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.profile-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin-left: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome-message {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.welcome-message h1 {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin: 0;
}
.welcome-message a {
  font-size: 30px;
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
}
.welcome-message p {
  font-size: 24px;
  color: #333;
  margin-top: 5px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

.stat-item p {
  background: #ecf0f1;
  font-family: sans-serif;
  border-radius: 10px;
  padding: 10px;
  font-size: 17px;
  color: #2c3e50;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}
</style>
