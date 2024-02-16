<template>
<nav class="navbar">
    <div class="logo">DevDuel</div>
    <ul class="nav-links" :class="{ 'nav-active': navOpen }">
    <li><router-link to="/signin">Home</router-link></li>
    <li><router-link to="/connect">Connect</router-link></li>
    <li><router-link to="">Account</router-link></li>
    <li><router-link to="">Contact</router-link></li>
    </ul>
    <div class="burger" @click="toggleNav">
    <div></div>
    <div></div>
    <div></div>
    </div>
</nav>
</template>

<script>
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
},
};
</script>

<style scoped>
.navbar {
display: flex;
justify-content: space-between;
align-items: center;
background-color: #193657;
color: white;
padding: 1rem;
font-family: 'Arial', sans-serif;
}

.logo {
  font-size: 2rem; /* Increase size */
  font-weight: bold;
  color: #f9f9f9;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add shadow for depth */
  transition: transform 0.3s ease; /* Smooth transition on hover */
}
.logo:hover {
  cursor: pointer;
  transform: scale(1.1); /* Slightly enlarge on hover */
}
.nav-links {
list-style: none;
display: flex;
transition: transform 0.3s ease-in;
}

.nav-links li {
padding: 0 20px;
font-weight: 100s;
}

.nav-links a {
color: white;
text-decoration: none;
transition: color 0.3s ease;
}

.nav-links a:hover {
color: #4a76a8;
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
    background-color: #45524b;
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
}
</style>
