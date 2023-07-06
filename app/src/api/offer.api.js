import axios from '@src/config/axios.conf';

export const getOffers = (params = {}) => {
  return axios.get('/offers', {
    params,
  });
};

export const getOffersByOrder = (order) => {
  return axios.get(`/offers/order/${order}`);
};

export const createOffer = (order) => {
  return axios.post('/offers', order);
};

export const getOfferByHash = (hash) => {
  return axios.get(`/offers/${hash}`);
};

export const getOfferByCreator = (creator) => {
  return axios.get(`/offers/creator/${creator}`);
};
