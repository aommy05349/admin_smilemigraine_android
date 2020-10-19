
export default {
    namespaced: true,
    state: {
        data: null,
        token: null,
    },
    mutations: {
        setPostsData: (state, data) => {
            state.data = data
        },
        resePostsrData: (state) => {
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
