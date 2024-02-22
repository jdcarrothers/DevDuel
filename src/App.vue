<template>
  <div>
    <NavBarComponent v-if="shouldShowNavbar" />
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
  computed: {
    shouldShowNavbar() {
      return !this.$route.meta.hideNavbar;
    },
  },
  mounted() {
    //check if there is a local storage token and if it is valid then redirect to the connect page else redirect to the signin page
    if (localStorage.getItem('username')) {
      console.log('User is already logged in');
      this.$router.push('/home');
    } else {
      this.$router.push('/signin');
    }     
    },
  methods: {
    },
  }

</script>

<style>
</style>
