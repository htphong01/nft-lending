import { ethers } from 'ethers';
import { LOAN_ADDRESS, CHAIN_ID, WXCR_ADDRESS } from '@src/constants';

const RPC_URL = 'https://rpc-kura.cross.technology';
export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const getNativeBalance = async (account) => {
  const balance = await provider.getBalance(account);
  return Number(ethers.formatEther(balance)).toFixed(2);
};

// export const generateSignature = async (data) => {
//   const provider = new ethers.BrowserProvider(window.ethereum, 'any');
//   const account = (await provider.listAccounts())[0];
//   const signer = provider.getSigner(account);

//   const bytes = new TextEncoder().encode(JSON.stringify(data));
//   const orderHash = ethers.sha256(bytes).slice(2);
//   const signature = await signer.signMessage(orderHash);
//   return signature;
// };

export const generateOrderSignature = async (order) => {
  const encodedOrder = ethers.solidityPack(
    ['address', 'address', 'uint256', 'string', 'string', 'string', 'string'],
    [order.creator, order.nftAddress, order.nftTokenId, order.offer, order.duration, order.rate, order.lender]
  );

  const orderHash = ethers.keccak256(encodedOrder);

  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);
  const signature = await signer.signMessage(orderHash);
  return signature;
};

// export const generateOfferSignature = async (
//   offerData,
//   signatureData,
//   loanContract = LOAN_ADDRESS,
//   chainId = CHAIN_ID
// ) => {
//   const {
//     offer,
//     repayment,
//     nftTokenId,
//     nftAddress,
//     duration,
//     adminFeeInBasisPoints = 25,
//     erc20Denomination = WXCR_ADDRESS,
//   } = offerData;
//   const encodedOffer = ethers.solidityPack(
//     ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint32', 'uint16'],
//     [erc20Denomination, offer, repayment, nftAddress, nftTokenId, duration, adminFeeInBasisPoints]
//   );

//   const { signer: signerAddress, nonce, expiry } = signatureData;

//   const encodedSignature = ethers.solidityPack(['address', 'uint256', 'uint256'], [signerAddress, nonce, expiry]);

//   const payload = ethers.solidityPack(
//     ['bytes', 'bytes', 'address', 'uint256'],
//     [encodedOffer, encodedSignature, loanContract, chainId]
//   );

//   const message = ethers.arrayify(ethers.keccak256(payload));

//   const provider = new ethers.BrowserProvider(window.ethereum, 'any');
//   const account = (await provider.listAccounts())[0];
//   const signer = provider.getSigner(account);
//   const signature = await signer.signMessage(message);
//   return signature;
// };

function getEncodedOffer(offer) {
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

export async function getOfferSignature(
  offer,
  signature,
  loan = LOAN_ADDRESS,
  chainId = CHAIN_ID
) {
  const encodedOffer = getEncodedOffer(offer);
  const encodedSignature = getEncodedSignature(signature);
  const message = getOfferMessage(encodedOffer, encodedSignature, loan, chainId);

  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = await provider.getSigner(account.address);

  const signedSignature = await signer.signMessage(message);
  return signedSignature;
}

function getEncodedSignature(signature) {
  const { signer, nonce, expiry } = signature;
  const payload = ethers.solidityPacked(["address", "uint256", "uint256"], [signer, nonce, expiry]);
  return payload;
}

function getOfferMessage(encodedOffer, encodedSignature, loanContract, chainId) {
  const payload = ethers.solidityPacked(
    ["bytes", "bytes", "address", "uint256"],
    [encodedOffer, encodedSignature, loanContract, chainId]
  );

  return ethers.getBytes(ethers.keccak256(payload));
}

// type RenogationStruct = {
//   loanId: BytesLike;
//   newLoanDuration: bigint;
//   newMaximumRepaymentAmount: bigint;
//   renegotiationFee: bigint;
// };

export async function getRenegotiationSignature(
  renogation,
  signature,
  signer,
  loan,
  chainId = 5555
) {
  const message = getEncodedRenegotiation(renogation, signature, loan, chainId);
  const sig = await signer.signMessage(message);

  return sig;
}

function getEncodedRenegotiation(
  renegotiation,
  signature,
  loanContract,
  chainId
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

export const getBlockNumber = async () => {
  return provider.getBlockNumber();
};

export const getTransactionByEvents = async (address, abi, eventName) => {
  try {
    const contract = new ethers.Contract(address, abi, provider);
    const toBlock = await getBlockNumber();
    // const toBlock = 99153;
    const events = await contract.queryFilter(eventName, toBlock - 10000, toBlock);
    return events;
  } catch (error) {
    return [];
  }
};

export const generateRequestSignature = async (
  requestData,
  signatureData,
  loanContract = LOAN_ADDRESS,
  chainId = CHAIN_ID
) => {
  const { loanId, loanDuration, renegotiateFee } = requestData;
  const { signer: signerAddress, nonce, expiry } = signatureData;

  const encodedSignature = ethers.solidityPack(['address', 'uint256', 'uint256'], [signerAddress, nonce, expiry]);

  const payload = ethers.solidityPack(
    ['bytes32', 'uint32', 'uint256', 'bytes', 'address', 'uint256'],
    [loanId, loanDuration, renegotiateFee, encodedSignature, loanContract, chainId]
  );

  const message = ethers.arrayify(ethers.keccak256(payload));

  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);
  const signature = await signer.signMessage(message);
  return signature;
};
