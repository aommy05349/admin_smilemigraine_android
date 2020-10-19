import axios from 'axios'
import apiConfig from './config/index.js'

let apiInstance = {
    api: null,
    weather: null,
    context: null
}

export const createInstance = (context) => {
    const { store, redirect } = context
    apiInstance.context = context
    const instance = axios.create({
        baseURL: apiConfig.ENDPOINT
    })

    instance.interceptors.request.use(config => {
        const { store } = context
        store.commit('loading/start')
        const token = store.state.user.token
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`
                // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjI3Mjk1MzgsImp0aSI6Ii01ZDI1NWM0MjNkMmQ3IiwiaXNzIjoiU21pbGVNaWdyYWluZSIsIm5iZiI6MTU2MjcyOTUzOCwiZXhwIjoxNTY0MDI1NTM4LCJkYXRhIjp7Im1lbWJlcl9pZCI6IjMwIiwiZW1haWwiOiJ0b25nMTc0NUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjEwMDAwIiwic3Vic2NyaXB0aW9uIjoiMCIsImNmIjp7ImMiOiJZamRib3FZYkdlZzc4bUh5TUVSZCIsImxvY2FsZSI6InRoIn19fQ.1-1G5VVvNlBhWPi11nbbQPLY5Kg9qomresn8LcwYVwE`
            }
        }
        return config
    })
    instance.interceptors.response.use(
        response => {
            store.commit('loading/end')
            return response
        },
        error => {
            store.commit('loading/end')
            if (error && error.response && error.response.status) {
                if (error.response.status === 401) {
                    alert('กรุณาเข้าสู่ระบบใหม่อีกครั้ง')
                    store.commit('user/resetUserData')
                    store.commit('user/resetToken')
                    redirect('/login')
                }
            }
            throw error
        }
    )
    apiInstance.api = instance
}

export default apiInstance
