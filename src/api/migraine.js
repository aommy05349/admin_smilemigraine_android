import axios from './instance'

export default {
    getMigraineLevel: (memberId, date) => {
    return axios.api.get(`/migraine/${memberId}/level/${date}`)
    .then(result =>   result.data)
  }
}