<template>
    <div>
        {{ this.user }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'MainMenu',
    mounted() {
        this.user.username = localStorage.getItem('username');
        this.populateStatistics();
    },
    data() {
        return {
            user: {
                username: '',
                codeRating: 0,
                gamesPlayed: 0,
                Wins: 0,
            },
        }
    },
    methods: {
        async populateStatistics() {
            try {
                const response = await axios.post('http://172.21.252.211:2000/requestStats', this.user);
                console.log(response.data.stats);
                response.data.stats.forEach(stat => {
                    this.user.codeRating = stat.codeRating;
                    this.user.gamesPlayed = stat.gamesPlayed;
                    this.user.Wins = stat.Wins;
                });
            } catch (error) {
                console.log("no stats on your screen? no problem nothing to see here move along now... nothing to see here... move along... move along... its cuz your not logged in will fix later");
            }
        },
    }
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>
