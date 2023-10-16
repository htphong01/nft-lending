import { OfferStatus, OrderStatus } from '@src/constants/enum';
import { WXCR_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';
import { ONE_DAY } from '@src/constants';
import { calculateRepayment } from './apr';
import { RequestStatus } from '../constants/enum';

export const sliceAddress = (address) => {
  return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
};

export const sliceHeadTail = (input, amount) => {
  return `${input.slice(0, amount)} ... ${input.slice(-amount + 1)}`;
};

export const calculateRealPrice = (price, rate, denominator) => {
  return (price + (price * rate) / denominator).toFixed(7);
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

export const getOfferStatusText = (status) => {
  return Object.fromEntries(Object.entries(OfferStatus).map((a) => a.reverse()))[status];
};

export const getOrderStatusText = (status) => {
  return Object.fromEntries(Object.entries(OrderStatus).map((a) => a.reverse()))[status];
};

export const getRequestStatusText = (status) => {
  return Object.fromEntries(Object.entries(RequestStatus).map((a) => a.reverse()))[status];
};

export const convertOfferDataToSign = (offer) => {
  const repayment = calculateRepayment(offer.offer, offer.rate, offer.duration);

  const offerData = {
    offer: ethers.utils.parseUnits(offer.offer, 18),
    repayment: ethers.utils.parseUnits(`${repayment}`, 18),
    nftTokenId: offer.nftTokenId,
    nftAddress: offer.nftAddress,
    duration: offer.duration * ONE_DAY,
    adminFeeInBasisPoints: 25,
    erc20Denomination: WXCR_ADDRESS,
  };

  const signatureData = {
    signer: offer.creator,
    nonce: getRandomInt(),
    expiry: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60 * offer.expiration,
  };

  return { offerData, signatureData };
};

export const convertRequestDataToSign = (request) => {
  console.log('request: ', request);
  const requestData = {
    loanId: request.loanId,
    loanDuration: request.loanDuration,
    renegotiateFee: ethers.utils.parseUnits(request.renegotiateFee, 18),
  };

  const signatureData = {
    signer: request.creator,
    nonce: getRandomInt(),
    expiry: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60 * +request.expiration,
  };

  return { requestData, signatureData };
};
