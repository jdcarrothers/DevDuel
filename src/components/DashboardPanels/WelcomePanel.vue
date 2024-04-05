<template>
  <div class="inner-container">
    <img :src="profileImg" alt="Profile Image" class="profile-image">
    <svg @click="NavigateToProfileManagment" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
    <div class="welcome-message">
      <h1>Welcome back, <span>{{ username }}</span>!</h1>
      <p>Get ready to code and improve your skills.</p>
    </div>
  </div>
</template>


<script>
export default {
  name: 'WelcomePanel',
  props: {
    username: String,
    profileImg: String,
  },
  methods: {
    NavigateToProfileManagment() {
      this.$router.push('/profile');
    },
  },
};
</script>

<style scoped>

.inner-container {
  position: relative; /* This is needed to position the edit-icon absolutely within the container */
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  border: none;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  color: #333;
  max-width: 500px;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.edit-icon {
  position: absolute;
  top: 8px; /* Adjust based on the size of the profile image and desired positioning */
  right: 8px; /* Adjust to align with the top-right corner of the profile image */
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Adjust size as needed */
  cursor: pointer; /* Changes the cursor to indicate the icon is clickable */
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.welcome-message h1 {
  margin-bottom: 0.5rem;
}

.welcome-message h1 span {
  color: #007BFF;
}

.welcome-message p {
  font-size: 20px;
  margin-bottom: 0;
}

</style>
