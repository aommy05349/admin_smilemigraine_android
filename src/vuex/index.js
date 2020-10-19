import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './user'
import loading from './loading'
import chatRooms from './chatRooms'
import posts from './posts'

Vue.use(Vuex)

const persistedstate = new createPersistedState({
  key: 'smile-migraine-admin',
  paths: [ 'user' ]
})

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    loading,
    chatRooms,
    posts
  },
  plugins: [ persistedstate ]
})
