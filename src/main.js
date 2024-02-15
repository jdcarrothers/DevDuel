// Import Vue and VueRouter
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// Import your components
import App from './App.vue'
import LobbyAdminPanelComponent from './components/LobbyAdminPanelComponent.vue'
import LiveQuestionComponent from './components/LiveComponent.vue'
import JoinOrCreateLobbyComponent from './components/JoinOrCreateLobbyComponent.vue'
import LobbyUserPanelComponent from './components/LobbyUserPanelComponent.vue'
import AdminQuizOverviewComponent from './components/AdminQuizOverviewComponent.vue'
import SigninComponent from './components/SigninComponent.vue'
import RegisterComponent from './components/RegisterComponent.vue'
import MainMenuComponent from './components/MainMenuComponent.vue'


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
  },
  { 
    name: 'AdminQuizOverview',
    path: '/admin/:lobbyID', 
    component: AdminQuizOverviewComponent 
  },
  {
    name: 'Signin',
    path: '/signin',
    component: SigninComponent
  },
  {
    name: 'Register',
    path: '/register',
    component: RegisterComponent
  },{
    name: 'MainMenu',
    path: '/home',
    component: MainMenuComponent
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