import { ethers } from 'ethers';

const getSignerAddress = (msg: string, signature: string) => {
  try {
    const signerAddress = ethers.verifyMessage(msg, signature);
    return signerAddress;
  } catch (e) {
    return '';
  }
};

const verifySignature = (signer: string, msg: any, signature: string) => {
  try {
    const signerAddress = getSignerAddress(msg, signature);
    return signerAddress.toLocaleLowerCase() === signer.toLocaleLowerCase();
  } catch (e) {
    return false;
  }
};

export const generateOfferMessage = (
  offerData: any,
  signatureData: any,
  loanContract,
  chainId,
) => {
  const {
    offer,
    rate,
    nftTokenId,
    nftAddress,
    duration,
    adminFeeInBasisPoints,
    erc20Denomination,
  } = offerData;
  const repayment = Number(offer) + (offer * rate) / 100;
  console.log('repayment', repayment);
  const encodedOffer = ethers.solidityPacked(
    ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint32', 'uint16'],
    [
      erc20Denomination,
      ethers.parseUnits(offer, 18),
      ethers.parseUnits(`${repayment}`, 18),
      nftAddress,
      nftTokenId,
      duration * 24 * 60 * 60,
      adminFeeInBasisPoints,
    ],
  );

  const { signer, nonce, expiry } = signatureData;

  const encodedSignature = ethers.solidityPacked(
    ['address', 'uint256', 'uint256'],
    [signer, nonce, expiry],
  );

  const payload = ethers.solidityPacked(
    ['bytes', 'bytes', 'address', 'uint256'],
    [encodedOffer, encodedSignature, loanContract, chainId],
  );
  return ethers.keccak256(payload);
};

export { getSignerAddress, verifySignature };
