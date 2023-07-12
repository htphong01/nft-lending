import { LOAN_ABI } from '@src/abi';
import { LOAN_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

const loanContract = (signerOrProvider) => {
  return new ethers.Contract(LOAN_ADDRESS, LOAN_ABI, signerOrProvider);
};
