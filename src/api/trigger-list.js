import axios from './instance'

export default {
    getTriggersList: (memberId) => {
    return axios.api.get(`/triggers/${memberId}`)
    .then(result => result.data)
  }
}