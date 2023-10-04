import axios from '@src/config/axios.conf';

export const getOffers = (params = {}) => {
  return axios.get('/requests', {
    params,
  });
};

export const acceptRequest = (id) => {
  return axios.post(`/${id}/requests`);
};

export const createRequest = (data) => {
  return axios.post('/requests', data);
};
