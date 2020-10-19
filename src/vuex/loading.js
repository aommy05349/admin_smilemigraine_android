export default {
    namespaced: true,
    state: {
        data: false
    },
    mutations: {
        start: (state) => {
            state.data = true
        },
        end: (state) => {
            state.data = false
        }
    },
    getters: {}
}
