<template>
    <div class="outer-container">
        <div class="inner-container">
            <h1>Badges Earned</h1>
            <div class="badges-layout">
                <div v-if="isPremium">
                    <img src="@/assets/devDuelPremium.png" alt="Premium Badge" class="badge" title="Premium Member Badge">
                </div>
                <div v-if="hasWon">
                    <img src="@/assets/devDuelWonAGame.png" alt="Winner Badge" class="badge" title="Winner of a Game">
                </div>
                <div v-if="tenOrMoreWins">
                    <img src="@/assets/devDuelWonTenGames.png" alt="10 Wins Badge" class="badge" title="Winner of Ten Games">
                </div>
                <div>
                    <img src="@/assets/devDuelMember.png" alt="Member Badge" class="badge" title="DevDuel Member"> 
                </div>
            </div>
            <p>{{ badgeMessage }}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'BadgesPanel',
    props: {
        isPremium: Boolean,
        Wins: Number,
    },
    data() {
        return {
            tenOrMoreWins: false,
            hasWon: false,
            badgeMessage: 'Keep up the great work!',
        };
    },
    created() {
        this.updateBadgeStatus();
    },
    methods: {
        updateBadgeStatus() {
            this.tenOrMoreWins = this.Wins >= 10;
            this.hasWon = this.Wins > 0;
            if (!this.isPremium && this.Wins === 0) {
                this.badgeMessage = 'Get a second badge by winning your first game!';
            }
        },
    },
};
</script>
<style scoped>
.inner-container {
  text-align: center;
}
.badge {
  width: 10vw;
  height: auto;
  max-width: 100px; 
}
.badges-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 20px;
}
.inner-container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  border: none; 
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25); 
  border-radius: 16px;
  color: #333;
  max-width: 300px;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}
.inner-container p{
    font-size: 20px;
  margin-bottom: 0; /* Adjust based on your layout needs */
}
.inner-container:hover {
  transform: translateY(-10px); 
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); 
}
@media (max-width: 768px) {
  .outer-container {
    width: 90vw;
    min-height: 60vh;
  }
  .badge {
    width: 15vw;
  }
}
</style>


