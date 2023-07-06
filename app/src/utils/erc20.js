import { ERC20_ABI } from '@src/abi/erc20';
import { WXCR_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const getBalance = async (account, contractAddress = WXCR_ADDRESS) => {
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(account);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const getContractSymbol = async (contractAddress = WXCR_ADDRESS) => {
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
  return contract.symbol();
};

export const checkAllowance = async (spender, account, amount, contractAddress = WXCR_ADDRESS) => {
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
  const allowance = await contract.allowance(account, spender);
  return allowance.gte(amount);
};

export const approveERC20 = async (spender, amount = ethers.constants.MaxInt256, contractAddress = WXCR_ADDRESS) => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);
  return contract.approve(spender, ethers.constants.MaxInt256);
};
