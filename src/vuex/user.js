
export default {
    namespaced: true,
    state: {
        data: null,
        token: null,
    },
    mutations: {
        setUserData: (state, data) => {
            state.data = data
        },
        resetUserData: (state) => {
            state.data = null
        },
        setToken: (state, data) => {
            state.token = data
        },
        resetToken: (state) => {
            state.token = null
        }
    },
    getters: {}
}
