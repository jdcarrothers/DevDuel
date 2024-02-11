// Import Vue and VueRouter
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// Import your components
import App from './App.vue'
import HostComponent from './components/HostComponent.vue'
import LiveQuestionComponent from './components/LiveQuestionComponent.vue'
import ConnectComponent from './components/ConnectComponent.vue'

// Define routes
const routes = [
  { path: '/', component: LiveQuestionComponent },
  { path: '/lobby/:lobbyID', component: HostComponent },
  { path: '/connect', component: ConnectComponent }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)


app.use(router)
app.mount('#app')
