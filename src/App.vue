<template>
  <div>
    <NavBarComponent />
    <RouterView />
  </div>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';
export default {
  name: 'App',
  components: {
    NavBarComponent
  },
  // remove when needed
  mounted() {
      // this.$router.push('/lobby/5871?lobbyCode=5871&username=d');
    },
}
</script>

<style>
</style>
