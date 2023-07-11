import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-kura.cross.technology';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const getBalance = async (account) => {
  const balance = await provider.getBalance(account);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const generateSignature = async (data) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);

  const bytes = new TextEncoder().encode(JSON.stringify(data));
  const orderHash = ethers.utils.sha256(bytes).slice(2);
  const signature = await signer.signMessage(orderHash);
  return signature;
};

export const getBlockNumber = async () => {
  return provider.getBlockNumber();
}