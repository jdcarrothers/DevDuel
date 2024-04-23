<template>
<nav class="navbar">
    <div class="logo">DevDuel</div>
    <ul class="nav-links" :class="{ 'nav-active': navOpen }">
      <li><router-link to="/dashboard">Home</router-link></li>
      <li><router-link to="/connect">Connect</router-link></li>
      <li><router-link to="">Account</router-link></li>
      <li><router-link to="">Contact</router-link></li>
      <li @click="signOutUser">Sign Out</li>
    </ul>
    <div class="burger" @click="toggleNav">
    <div></div>
    <div></div>
    <div></div>
    </div>
</nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';

export default {
data() {
    return {
    navOpen: false,
    };
},
methods: {
    toggleNav() {
    this.navOpen = !this.navOpen;
    },
    async signOutUser() {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      this.$router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
},
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2f5683; /* Matching the button color for consistency */
  color: white;
  padding: 1rem;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adding shadow for depth */
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  color: #f9f9f9;
  transition: transform 0.3s ease; /* Smooth transition on hover */
}

.logo:hover {
  cursor: pointer;
  transform: scale(1.05); /* Slightly enlarge on hover for interactivity */
}

.nav-links {
  list-style: none;
  display: flex;
  transition: transform 0.3s ease-in;
}

.nav-links li {
  padding: 0 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #e6eef8; /* Lighter blue shade for hover state, matching selected question background */
}

.burger {
  display: none;
  cursor: pointer;
}

.burger div {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 5px;
  transition: all 0.3s ease;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    width: 100%;
    position: absolute;
    right: 0;
    top: 8vh;
    background-color: #3a5a78; /* Slightly darker shade for mobile menu */
    transform: translateX(100%);
    transition: transform 0.5s ease-in;
  }

  .nav-links.nav-active {
    transform: translateX(0%);
  }

  .nav-links li {
    text-align: center;
    padding: 10px;
  }

  .burger {
    display: block;
  }

  .burger.active div:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .burger.active div:nth-child(2) {
    opacity: 0;
  }

  .burger.active div:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
}
</style>