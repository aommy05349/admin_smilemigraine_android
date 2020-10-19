import axios from './instance'

export default {
  getMedicinesByPageId: id => {
    return axios.api.get(`/medicines/page/${id}`)
        .then(result => result.data)
  },
  getMedicinesPrev: (medicineID, days) => {
    return axios.api.get(`/medicines/members/${medicineID}/prev/${days}`)
    .then(result => result.data)
  },
  getMedicinesById: id => {
    return axios.api.get(`/medicines/${id}`)
        .then(result => result.data)
  },
  updateMedicines: (id, body) => {
    return axios.api.patch(`/medicines/${id}`, body)
        .then(result => result.data)
  },
  addMedicines: (body) => {
    return axios.api.post(`/medicines`, body)
        .then(result => result.data)
  },

}