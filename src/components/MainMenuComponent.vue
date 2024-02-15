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
                totalCorrectAnswers: 0,
                totalIncorrectAnswers: 0,
                totalPoints: 0,
                totalQuestions: 0,
                totalQuizzes: 0,
                totalTimeSpent: 0
            },
        }
    },
    methods: {
        async populateStatistics() {
            try {
                const response = await axios.post('http://192.168.0.24:2000/requestStats', this.user);
                console.log(response.data.stats);
            } catch (error) {
                alert(error.response.data.message)
            }
        },
    }
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>
