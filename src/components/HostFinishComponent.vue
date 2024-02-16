<template>
  <div>
    {{ this.lobbyCode }}
    {{ this.first }}
    {{ this.second }}
    {{ this.third }}
  </div>
</template>

<script>
export default {
    name: 'HostFinishComponent',
    data() {
        return {
            socket: null,
            lobbyCode: null,
            first: "",
            second: "",
            third: "",
        };
    },
    mounted() {
        this.socket = socketio(process.env.VUE_APP_SERVER_URL);
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        this.lobbyCode = this.$route.query.lobbyCode || this.$route.params.lobbyCode;
        this.socket.emit('endGame', this.lobbyCode);
        this.socket.once('gameEnded', (arrayOfPlayers) => {
            if (arrayOfPlayers[0]) {
                this.first = arrayOfPlayers[0];
            }
            if (arrayOfPlayers[1]) {
                this.second = arrayOfPlayers[1];
            }
            if (arrayOfPlayers[2]) {
                this.third = arrayOfPlayers[2];
            }

        });
    },
};
</script>

<style scoped>
/* Your style code here */
</style>
