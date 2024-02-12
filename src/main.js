// Import Vue and VueRouter
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// Import your components
import App from './App.vue'
import LobbyAdminPanelComponent from './components/LobbyAdminPanelComponent.vue'
import LiveQuestionComponent from './components/LiveQuestionComponent.vue'
import JoinOrCreateLobbyComponent from './components/JoinOrCreateLobbyComponent.vue'
import LobbyUserPanelComponent from './components/LobbyUserPanelComponent.vue'


// Define routes
const routes = [
  { 
    name: 'LiveQuestion',
    path: '/lobby/:lobbyID', 
    component: LiveQuestionComponent,
  },
  { 
    name: 'HostLobbyAdmin',
    path: '/host/:lobbyID', 
    component: LobbyAdminPanelComponent,
  },
  { 
    name: 'UserLobby',
    path: '/join/:lobbyID', 
    component: LobbyUserPanelComponent,
    params: true
  },
  { 
    name: 'CreateLobby',
    path: '/connect', 
    component: JoinOrCreateLobbyComponent 
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)


app.use(router)
app.mount('#app')