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
  mounted() {
    //check if there is a local storage token and if it is valid then redirect to the connect page else redirect to the signin page
    if (localStorage.getItem('token')) {
      this.$router.push('/connect');
    } else {
      this.$router.push('/register');
    } 
    },
  methods: {
    },
  }

</script>

<style>
</style>
