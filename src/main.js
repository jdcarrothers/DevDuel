import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store';
import App from './App.vue'
import LobbyAdminPanelComponent from './components/LobbyAdminPanelComponent.vue'
import LiveQuestionComponent from './components/LiveComponent.vue'
import LobbyUserPanelComponent from './components/LobbyUserPanelComponent.vue'
import AdminQuizOverviewComponent from './components/AdminQuizOverviewComponent.vue'
import SigninComponent from './components/SigninComponent.vue'
import SignupComponent from './components/SignupComponent.vue'
import DashboardComponent from './components/DashboardComponent.vue'
import HostFinishComponent from './components/HostFinishComponent.vue'
import UserFinishComponent from './components/UserFinishComponent.vue'
const routes = [
  { 
    name: 'LiveQuestion',
    path: '/lobby/:lobbyID/', 
    component: LiveQuestionComponent,
  },
  { 
      path: '/host/:lobbyID', // Use a dynamic segment to receive the lobbyCode
      name: 'Host',
      component: LobbyAdminPanelComponent,
      props: false  // Enables props being passed as route parameters
  },
  { 
    name: 'UserLobby',
    path: '/join/:lobbyCode/', 
    component: LobbyUserPanelComponent,
    params: true
  },
  { 
    name: 'AdminQuizOverview',
    path: '/admin/:lobbyCode/', 
    component: AdminQuizOverviewComponent 
  },
  {
    name: 'Signin',
    path: '/signin',
    component: SigninComponent,
    meta: {hideNavbar: true}
  },
  {
    name: 'Register',
    path: '/signup',
    component: SignupComponent,
    meta: {hideNavbar: true}
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: DashboardComponent
  }
  ,
  {
    name: 'HostFinish',
    path: '/end/:lobbyCode/',
    component: HostFinishComponent
  }
  ,
  {
    name: 'UserFinish',
    path: '/endUser/',
    component: UserFinishComponent
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
  
app.use(store);
app.use(router)
app.mount('#app')