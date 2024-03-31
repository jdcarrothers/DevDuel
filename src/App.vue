<template>
  <div>
    <NavBarComponent v-if="shouldShowNavbar" />
    <RouterView />
  </div>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
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
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user && this.$route.meta.requiresAuth) {
        this.$router.push('/signin');
      }
    });
  },
}

</script>

<style>
</style>
