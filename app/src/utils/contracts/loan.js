import { LOAN_ABI } from '@src/abi';
import { LOAN_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

export const loanContract = (signerOrProvider) => {
  return new ethers.Contract(LOAN_ADDRESS, LOAN_ABI, signerOrProvider);
};

export const acceptOffer = (offer, signature) => {
  const contract = loanContract(signer);
  return contract.acceptOffer(offer, signature);
};

export const payBackLoan = (loanId) => {
  const contract = loanContract(signer);
  return contract.payBackLoan(loanId);
};
