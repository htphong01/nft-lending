import hre, { ethers } from "hardhat";
import { AddressLike, BytesLike, Signer } from "ethers";
import { LoanData } from "../typechain-types/contracts/loans/direct/loanTypes/DirectLoanFixedOffer";

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

async function getOfferSignature(
  offer: LoanData.OfferStruct,
  signature: LoanData.SignatureStruct,
  signer: Signer,
  loan: AddressLike,
  chainId = 31337
) {
  const encodedOffer = getEncodedOffer(offer);
  const encodedSignature = getEncodedSignature(signature);
  const message = getOfferMessage(encodedOffer, encodedSignature, loan, chainId);
  const sig = await signer.signMessage(message);

  return sig;
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

async function getRenogationSignature(
  renogation: RenogationStruct,
  signature: LoanData.SignatureStruct,
  signer: Signer,
  loan: AddressLike,
  chainId = 31337
) {
  const message = getEncodedRenogation(renogation, signature, loan, chainId);
  const sig = await signer.signMessage(message);

  return sig;
}

function getEncodedRenogation(
  renogation: RenogationStruct,
  signature: LoanData.SignatureStruct,
  loanContract: AddressLike,
  chainId: number
) {
  const payload = ethers.solidityPacked(
    ["bytes", "uint32", "uint256", "uint256", "bytes", "address", "uint256"],
    [
      renogation.loanId,
      renogation.newLoanDuration,
      renogation.newMaximumRepaymentAmount,
      renogation.renegotiationFee,
      getEncodedSignature(signature),
      loanContract,
      chainId,
    ]
  );

  return ethers.getBytes(ethers.keccak256(payload));
}

const getRandomInt = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

const getCurrentBlock = async () => {
  const latestBlock = await ethers.provider.getBlock("latest");
  return latestBlock?.number;
};

const skipBlock = async (blockNumber: number) => {
  for (let index = 0; index < blockNumber; index++) {
    await hre.ethers.provider.send("evm_mine");
  }
};

async function getTimestamp() {
  const latestBlock = await ethers.provider.getBlock("latest");
  return latestBlock ? latestBlock.timestamp : 0;
}

async function skipTime(seconds: number) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}

export {
  getRandomInt,
  getEncodedOffer,
  getEncodedSignature,
  getOfferMessage,
  getRenogationSignature,
  getCurrentBlock,
  skipBlock,
  getTimestamp,
  skipTime,
  getOfferSignature,
};
