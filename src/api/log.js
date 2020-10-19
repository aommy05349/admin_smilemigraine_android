import axios from './instance'

export default {
  getLogs: id => {
    return axios.api.get(`/logs/${id}`)
        .then(result => result.data)
  },
  
}