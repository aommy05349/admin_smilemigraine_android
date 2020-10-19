import axios from './instance'

export default {
  getDailynewsByPageId: id => {
    return axios.api.get(`/dailynews/page/${id}`)
        .then(result => result.data)
  },
  deleteDailynews: id => {
    return axios.api.delete(`/dailynews/${id}`)
        .then(result => result.data)
  },
  getDailynewsById: id => {
    console.log(id);
    return axios.api.get(`/dailynews/${id}`)
        .then(result => result.data)
  },
  updateDailynews: (id, body) => {
    return axios.api.patch(`/dailynews/${id}`, body)
        .then(result => result.data)
  },
  addDailynews: (body) => {
    return axios.api.post(`/dailynews`, body)
        .then(result => result.data)
  },

}