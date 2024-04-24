import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      lobbyID: null,
      username: null
    };
  },
  mutations: {
    setLobbyID(state, lobbyID) {
      state.lobbyID = lobbyID;
    },
    setUsername(state, username) {
      state.username = username;
    }
  },
  actions: {
    updateLobbyID({ commit }, lobbyID) {
      commit('setLobbyID', lobbyID);
    },
    updateUsername({ commit }, username) {
      commit('setUsername', username);
    }
  }
});

export default store;
