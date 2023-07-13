import { ethers } from 'ethers';

const ONE_DAY = 24 * 60 * 60;

export const convertOfferDataToSign = (offer) => {
  const repayment = (offer.offer + (offer.offer * offer.rate) / 1e2).toString();

  const offerData = {
    offer: ethers.parseUnits(offer.offer, 18),
    repayment: ethers.parseUnits(repayment, 18),
    nftTokenId: offer.nftTokenId,
    nftAddress: offer.nftAddress,
    duration: offer.duration * ONE_DAY,
    adminFeeInBasisPoints: offer.adminFeeInBasisPoints,
    erc20Denomination: offer.erc20Denomination,
  };

  return offerData;
};
