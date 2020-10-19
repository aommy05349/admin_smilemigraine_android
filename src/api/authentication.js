import axios from './instance'

export default {
  login: (body) => {
    return axios.api.post('/authentications', body)
        .then(result => result.data)
  }
}