<template>
  <div>
    <RouterView />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  // remove when needed
  mounted() {
      this.$router.push('/connect');
    },
}
</script>

<style>
</style>
