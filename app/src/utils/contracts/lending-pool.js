import { LENDING_POOL_ABI, WXCRS_ABI } from '@src/abi';
import { LENDING_POOL_ADDRESS, WXCRs_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

const lendingPoolContract = (signerOrProvider) => {
  return new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signerOrProvider);
};

export const getTotalBalanceOfUser = async (address, options) => {
  const contract = new ethers.Contract(WXCRs_ADDRESS, WXCRS_ABI, provider);
  const balance = await contract.balanceOf(address, { ...options });
  console.log('balance', balance);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const getStakedPerUser = async (address, options) => {
  const contract = lendingPoolContract(provider);
  const balance = await contract.totalStakedPerUsers(address, { ...options });
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const getPoolBalance = async (options) => {
  const contract = lendingPoolContract(provider);
  const balance = await contract.totalStake({ ...options });
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const stake = async (amount) => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.stake(amount);
  await tx.wait();
  return tx;
};

export const unstake = async (amount) => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.unstake(amount);
  await tx.wait();
  return tx;
};
