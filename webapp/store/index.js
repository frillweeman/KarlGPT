export const state = () => ({
  user: null,
  personas: []
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setPersonas(state, personas) {
    state.personas = personas;
  },
};

export const actions = {
  setPersonas({ commit }) {
    return this.$getFirebaseFunction("getUserPersonas")().then((result) => {
      commit("setPersonas", result.data);
    });
  }
};
