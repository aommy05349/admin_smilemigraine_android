import axios from './instance'

export default {
  getHeadachesPrev: (memberId, days) => {
    return axios.api.get(`/headaches/members/${memberId}/prev/${days}`)
    .then(result => result.data)
  },
  getFrequencyPain : (memberId, days) => {
    return axios.api.get(`/getFrequencyPain/${memberId}/prev/${days}`)
    .then(result => result.data)
  },
}
