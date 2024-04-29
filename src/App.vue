<template>
  <div>
    <NavBarComponent v-if="shouldShowNavbar" />
    <RouterView />
  </div>
</template>

<script>
import NavBarComponent from "./components/NavBarComponent.vue";
// import { onAuthStateChanged } from "firebase/auth";
// import { getAuth } from "firebase/auth";
export default {
  name: "App",
  components: {
    NavBarComponent,
  },
  computed: {
    shouldShowNavbar() {
      return !this.$route.meta.hideNavbar;
    },
  },
  mounted() {
    // const auth = getAuth();
    // onAuthStateChanged(auth, (user) => {
    //   if (user == null) {
    //     if (!this.$route.meta.hideNavbar) this.$router.push("/signin");
    //     // Redirect to signin page if user is not signed in
    //     else this.$router.push("/signin");
    //   } else {
    //     this.$router.push("/dashboard");
    //   }
    // });
  },
};
</script>

<style></style>
