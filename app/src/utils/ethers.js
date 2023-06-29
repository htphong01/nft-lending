import { ethers } from "ethers";

const RPC_URL = "https://rpc-kura.cross.technology";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const getBalance = async (account) => {
  const balance = await provider.getBalance(account);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};
