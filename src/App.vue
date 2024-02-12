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
      this.$router.push('/connect');
    },
}
</script>

<style>
</style>
