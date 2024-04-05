<template>
<div class="outer-container">
    <div class="inner-container">
    <h1>Game Stats Overview</h1>
    <div class="stats-layout">
        <div>
        <p>Lobbies Won: <strong>{{ lobbyWins }}</strong></p>
        </div>
        <div>
        <p>Games Played: <strong>{{ gamesPlayed }}</strong></p>
        </div>
        <div>
        <p>Problems Solved: <strong>{{ problemsSolved }}</strong></p>
        </div>
        <div>
        <p>Duels Won: <strong>{{ duelsWon }}</strong></p>
        </div>
        <div>
        <p>Duels Lost: <strong>{{ duelsLost }}</strong></p>
        </div>
    </div>
    <p>Keep up the great work!</p>
    </div>
</div>
</template>

<script>
export default {
name: 'GenericStatsPanel',
props: {
    gamesPlayed: Number,
    problemsSolved: Number,
    lobbyWins: Number,
    duelsWon: Number,
    duelsLost: Number,
},
};
</script>

<style scoped>
.outer-container {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.inner-container {
text-align: center;
display: flex;
flex-direction: column;
background: linear-gradient(145deg, #e6e6e6, #ffffff);
border: none;
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
border-radius: 16px;
color: #333;
max-width: 300px;
padding: 20px;
transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.inner-container:hover {
transform: translateY(-10px);
box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.stats-layout {
display: grid;
grid-template-columns: repeat(1, 1fr);
grid-gap: 20px;
padding: 20px;
}

p {
font-size: 20px;
margin-bottom: 0; /* Adjust based on your layout needs */
}

@media (max-width: 768px) {
.outer-container {
    width: 90vw;
    min-height: 60vh;
}
}
</style>
