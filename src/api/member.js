import axios from './instance'

export default {
  getMemberByPageId: id => {
    return axios.api.get(`/members/page/${id}`)
        .then(result => result.data)
  },
  getMemberById: id => {
    console.log('getMemberById');
    console.log(id);
    return axios.api.get(`/members/${id}`)
        .then(
          result => result.data
          )
  },
  getPurchaseByMemberId: id => {
    return axios.api.get(`/purchasing/members/${id}`)
        .then(result => result.data)
  },
  searchMembersByText: body => {
    return axios.api.post(`/members/search`, body)
        .then(result => result.data)
  },
  
}