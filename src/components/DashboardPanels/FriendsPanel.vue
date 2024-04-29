<template>
  <div>
    <!-- Your component's HTML template goes here -->
    <h1>Friends Panel</h1>
    <ul>
      <li v-for="friend in friends" :key="friend.id">{{ friend.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friends: [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ],
    };
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
h1 {
  color: blue;
}
</style>
