import { LENDING_POOL_ABI, POINT_ABI } from '@src/abi';
import { LENDING_POOL_ADDRESS, POINT_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

const lendingPoolContract = (signerOrProvider = provider) => {
  return new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signerOrProvider);
};

export const pointContract = (signerOrProvider = provider) => {
  return new ethers.Contract(POINT_ADDRESS, POINT_ABI, signerOrProvider);
}

export const getTotalBalanceOfUser = async (address, options = {}) => {
  const contract = pointContract();
  const balance = await contract.balanceOf(address, { ...options });
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const getStakedPerUser = async (address, options = {}) => {
  const contract = lendingPoolContract(provider);
  const balance = (await contract.poolStakers(address, { ...options })).amount;
  console.log('hehe', await contract.tokenToDiscountFactor('4900000000000000000'));
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const getPoolBalance = async (options = {}) => {
  const contract = lendingPoolContract(provider);
  const totalStake = await contract.totalStake({ ...options });
  const totalReward = await contract.totalReward({ ...options });
  return Number(ethers.utils.formatEther(totalStake.add(totalReward))).toFixed(2);
};

export const stake = async (amount) => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.stake(amount);
  await tx.wait();
  return tx;
};

export const unstake = async () => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.unstake();
  await tx.wait();
  return tx;
};

export const claimReward = async (amount) => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.harvestRewards(amount);
  await tx.wait();
  return tx;
};

export const getPoolPoints = async (address) => {
  const contract = pointContract();
  const account = await contract.balanceOf(address);
  const total = await contract.totalSupply();
  return {
    account: Number(ethers.utils.formatEther(account)).toFixed(2),
    total: Number(ethers.utils.formatEther(total)).toFixed(2)
  }
}
