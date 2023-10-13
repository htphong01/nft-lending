import axios from '@src/config/axios.conf';

export const acceptRequest = (id) => {
  return axios.post(`/${id}/requests`);
};

export const createRequest = (data) => {
  return axios.post('/requests', data);
};

export const getRequests = (params) => {
  return axios.get('/requests', {
    params,
  });
};

export const updateRequest = (id, data) => {
  return axios.patch(`/requests/${id}`, data);
};
