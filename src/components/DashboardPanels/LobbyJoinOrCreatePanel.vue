<template>
    <div class="panel">
        <p>Choose an option below to join an existing lobby or create a new one.</p>
        <InputComponent :PlaceholderText="'Enter Lobby Code'" v-model="inputValue" />
        <ButtonComponent :Text="'Join Lobby'" />
        <ButtonComponent :Text="'Create Lobby'" />
    </div>
</template>

<script>
import ButtonComponent from '../UI_Components/ButtonComponent.vue';
import InputComponent from '../UI_Components/InputComponent.vue';

export default {
    name: 'LobbyJoinOrCreatePanel',
    components: {
        ButtonComponent,
        InputComponent
    },
    data() {
        return {
            inputValue: ''
        };
    },
    watch: {
        inputValue(newValue) {
            console.log(newValue + " is the input value from the input component");
        }
    },
    mounted() {
        // Code to run when the component is mounted goes here
    }
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>