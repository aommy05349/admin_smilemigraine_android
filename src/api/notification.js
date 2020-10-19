import axios from './instance'

export default {
  sendNotification: (body) => {
      console.log(body)
    return axios.api.post('/notification', body)
        .then(result => result.data)
  }
}