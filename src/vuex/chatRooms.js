export default {
    namespaced: true,
    state: {
        data: [],
        listener: null
    },
    mutations: {
        setchatRooms: (state, data) => {
            state.data = data
        },
        resetchatRooms: (state) => {
            state.data = []
        },
        setListener: (state, data) => {
            state.listener = data
        },
        resetListener: (state) => {
            state.listener = null
        }
    },
    getters: {}
}
