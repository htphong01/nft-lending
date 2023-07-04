import { ethers } from 'ethers';
import { DOMAIN } from '@src/constants/signature';

const RPC_URL = 'https://rpc-kura.cross.technology';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const getBalance = async (account) => {
  const balance = await provider.getBalance(account);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const generateSignature = async (data, types) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);

  const signature = await signer._signTypedData(DOMAIN, types, data);
  return signature;
};
