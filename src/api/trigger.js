import axios from './instance'

export default {
    getTriggersPrev: (memberId, days) => {
    return axios.api.get(`/triggers/members/${memberId}/prev/${days}`)
    .then(result => result.data)
  }
}