import { AddressLike, BytesLike, ethers, parseEther, Signer } from 'ethers';
import { calculateRepayment } from './apr';
import { LoanData } from 'src/typechain-types/contracts/loans/direct/DirectLoanFixedOffer';
import config from 'src/config';

const ONE_DAY = 24 * 60 * 60;

const getSignerAddress = (msg: string, signature: string) => {
  try {
    const signerAddress = ethers.verifyMessage(msg, signature);
    return signerAddress;
  } catch (e) {
    return '';
  }
};

export const verifySignature = (signer: string, msg: any, signature: string) => {
  try {
    const signerAddress = getSignerAddress(msg, signature);
    return signerAddress.toLocaleLowerCase() === signer.toLocaleLowerCase();
  } catch (e) {
    return false;
  }
};

// export const getOfferSignature = (
//   offerData: any,
//   signatureData: any,
//   loanContract,
//   chainId,
// ) => {
//   const {
//     offer,
//     rate,
//     nftCollateralContract,
//     nftCollateralId,
//     duration,
//     adminFeeInBasisPoints,
//     erc20Denomination,
//     lendingPoolAddress = ethers.ZeroAddress
//   } = offerData;
//   const repayment = calculateRepayment(offer, rate, duration);

//   const encodedOffer = ethers.solidityPacked(
//     ["address", "uint256", "uint256", "address", "uint256", "uint32", "uint16", "address"],
//     [
//       erc20Denomination,
//       ethers.parseUnits(offer, 18),
//       ethers.parseUnits(repayment, 18),
//       nftCollateralContract,
//       nftCollateralId,
//       duration * ONE_DAY,
//       adminFeeInBasisPoints,
//       ethers.parseUnits(rate, 18).toString(),
//       lendingPoolAddress
//     ],
//   );

//   const { signer, nonce, expiry } = signatureData;

//   const encodedSignature = ethers.solidityPacked(
//     ['address', 'uint256', 'uint256'],
//     [signer, nonce, expiry],
//   );

//   const payload = ethers.solidityPacked(
//     ['bytes', 'bytes', 'address', 'uint256'],
//     [encodedOffer, encodedSignature, loanContract, chainId],
//   );
//   return ethers.keccak256(payload);
// };

// export const generateRequestMessage = (
//   requestData: any,
//   signatureData: any,
//   loanContract,
//   chainId,
// ) => {
//   const { offer, loanDuration, renegotiateFee } = requestData;
//   const { signer, nonce, expiry } = signatureData;

//   const encodedSignature = ethers.solidityPacked(
//     ['address', 'uint256', 'uint256'],
//     [signer, nonce, expiry],
//   );

//   const payload = ethers.solidityPacked(
//     ['bytes32', 'uint32', 'uint256', 'bytes', 'address', 'uint256'],
//     [
//       offer,
//       loanDuration * ONE_DAY,
//       ethers.parseUnits(renegotiateFee, 18).toString(),
//       encodedSignature,
//       loanContract,
//       chainId,
//     ],
//   );
//   return ethers.keccak256(payload);
// };

function getEncodedOffer(offer: LoanData.OfferStruct) {
  const {
    principalAmount,
    maximumRepaymentAmount,
    nftCollateralId,
    nftCollateralContract,
    duration,
    adminFeeInBasisPoints,
    erc20Denomination,
    lendingPool,
  } = offer;
  const payload = ethers.solidityPacked(
    ["address", "uint256", "uint256", "address", "uint256", "uint32", "uint16", "address"],
    [
      erc20Denomination,
      principalAmount,
      maximumRepaymentAmount,
      nftCollateralContract,
      nftCollateralId,
      duration,
      adminFeeInBasisPoints,
      lendingPool,
    ]
  );
  return payload;
}

export function hashOfferMessage(offerMessage: Uint8Array) {
  return ethers.keccak256(offerMessage);
}

export function createOfferMessage(
  offer: LoanData.OfferStruct,
  signature: LoanData.SignatureStruct,
  loan: AddressLike,
  chainId = Number(config.ENV.CHAIN_ID)
) {
  const encodedOffer = getEncodedOffer(offer);
  const encodedSignature = getEncodedSignature(signature);
  const message = getOfferMessage(encodedOffer, encodedSignature, loan, chainId);
  return message

  // const sig = await signer.signMessage(message); // Do at client side
  // return sig;
}

function getEncodedSignature(signature: LoanData.SignatureStruct) {
  const { signer, nonce, expiry } = signature;
  const payload = ethers.solidityPacked(["address", "uint256", "uint256"], [signer, nonce, expiry]);
  return payload;
}

function getOfferMessage(encodedOffer: string, encodedSignature: string, loanContract: AddressLike, chainId: number) {
  const payload = ethers.solidityPacked(
    ["bytes", "bytes", "address", "uint256"],
    [encodedOffer, encodedSignature, loanContract, chainId]
  );

  return ethers.getBytes(ethers.keccak256(payload));
}

type RenogationStruct = {
  loanId: BytesLike;
  newLoanDuration: bigint;
  newMaximumRepaymentAmount: bigint;
  renegotiationFee: bigint;
};

export async function getRenegotiationSignature(
  renogation: RenogationStruct,
  signature: LoanData.SignatureStruct,
  signer: Signer,
  loan: AddressLike,
  chainId = Number(config.ENV.CHAIN_ID)
) {
  const message = getEncodedRenegotiation(renogation, signature, loan, chainId);
  const sig = await signer.signMessage(message);

  return sig;
}

function getEncodedRenegotiation(
  renegotiation: RenogationStruct,
  signature: LoanData.SignatureStruct,
  loanContract: AddressLike,
  chainId: number
) {
  const payload = ethers.solidityPacked(
    ["bytes", "uint32", "uint256", "uint256", "bytes", "address", "uint256"],
    [
      renegotiation.loanId,
      renegotiation.newLoanDuration,
      renegotiation.newMaximumRepaymentAmount,
      renegotiation.renegotiationFee,
      getEncodedSignature(signature),
      loanContract,
      chainId,
    ]
  );

  return ethers.getBytes(ethers.keccak256(payload));
}

export const generateItemMessage = (
  itemData: any,
  marketplaceContract,
  chainId,
  createdAt,
) => {
  const { nft, tokenId, price, creator } = itemData;

  const itemHash = ethers.solidityPacked(
    ['address', 'uint256', 'uint256', 'address'],
    [nft, tokenId, parseEther(price.toString()), creator],
  );

  const payload = ethers.solidityPacked(
    ['bytes', 'address', 'uint256', 'uint256'],
    [itemHash, marketplaceContract, chainId, createdAt],
  );
  return ethers.keccak256(payload);
};
