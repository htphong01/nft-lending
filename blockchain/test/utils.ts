import hre, { ethers } from "hardhat";
import { Offer, Signature } from "./types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const ZERO_ADDRESS = ethers.ZeroAddress;
const MAX_UINT256 = ethers.MaxUint256;

async function signatureData(taskId, users, rewards, nonce, privateKey) {
  const { chainId } = await ethers.provider.getNetwork();
  // 66 byte string, which represents 32 bytes of data
  let messageHash = encodeData(chainId, taskId, users, rewards, nonce);

  // 32 bytes of data in Uint8Array
  let messageHashBinary = ethers.utils.arrayify(messageHash);
  let wallet = new ethers.Wallet(privateKey);

  // To sign the 32 bytes of data, make sure you pass in the data
  const signature = await wallet.signMessage(messageHashBinary);
  return signature;
}

function encodeData(chainId, taskId, users, rewards, nonce) {
  const payload = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "address[]", "uint256[]", "uint256"],
    [chainId, taskId, users, rewards, nonce]
  );
  return ethers.keccak256(payload);
}

function getEncodeOffer(offer: Offer) {
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
  offer: Offer,
  signature: Signature,
  signer: SignerWithAddress,
  loanAddress: string,
  chainId = 31337
) {
  const encodedOffer = getEncodeOffer(offer);
  const encodedSignature = getEncodedSignature(signature);
  const message = getMessage(encodedOffer, encodedSignature, loanAddress, chainId);
  const sig = await signer.signMessage(message);

  return sig;
}

function getEncodedSignature(signature: Signature) {
  const { signer, nonce, expiry } = signature;
  const payload = ethers.solidityPacked(["address", "uint256", "uint256"], [signer, nonce, expiry]);
  return payload;
}

function getMessage(encodedOffer: string, encodedSignature: string, loanContract: string, chainId: number) {
  const payload = ethers.solidityPacked(
    ["bytes", "bytes", "address", "uint256"],
    [encodedOffer, encodedSignature, loanContract, chainId]
  );
  // return new TextEncoder("utf-8").encode(ethers.utils.keccak256(payload));
  return ethers.getBytes(ethers.keccak256(payload));
}

const getRandomInt = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

const getCurrentBlock = async () => {
  const latestBlock = await hre.ethers.provider.getBlock("latest");
  return latestBlock.number;
};

const skipBlock = async (blockNumber: number) => {
  for (let index = 0; index < blockNumber; index++) {
    await hre.ethers.provider.send("evm_mine");
  }
};

async function getTimestamp() {
  const latestBlock = await ethers.provider.getBlock("latest");
  return latestBlock.timestamp;
}

async function skipTime(seconds: number) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}

export {
  getRandomInt,
  encodeData,
  getEncodeOffer,
  getEncodedSignature,
  getMessage,
  getCurrentBlock,
  skipBlock,
  getTimestamp,
  skipTime,
  ZERO_ADDRESS,
  MAX_UINT256,
  getOfferSignature,
};
