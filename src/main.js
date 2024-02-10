// Import Vue and VueRouter
import { createApp } from 'vue'
import { createRouter,  createWebHistory } from 'vue-router'

// Import your components
import App from './App.vue'
import HostComponent from './components/HostComponent.vue'
import ConnectComponent from './components/ConnectComponent.vue'

// Define routes
const routes = [
  { path: '/', component: ConnectComponent },
  { path: '/./lobby', component: HostComponent }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount the root Vue app
const app = createApp(App)

// Register components
app.component('HostComponent', HostComponent)
app.component('ConnectComponent', ConnectComponent)

app.use(router)
app.mount('#app')