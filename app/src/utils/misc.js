import { OfferStatus, OrderStatus } from '@src/constants/enum';

export const sliceAddress = (address) => {
  return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
};

export const calculateRealPrice = (price, rate, denominator) => {
  return (price + (price * rate) / denominator).toFixed(7);
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getOfferStatusText = (status) => {
  return Object.fromEntries(Object.entries(OfferStatus).map((a) => a.reverse()))[status];
};

export const getOrderStatusText = (status) => {
  return Object.fromEntries(Object.entries(OrderStatus).map((a) => a.reverse()))[status];
};
