import { Contract, JsonRpcProvider, ethers } from 'ethers';
import * as LENDING_POOL_ABI from './abi.json';
import config from 'src/config';

const rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
const lendingPoolContract = new Contract(
  config.ENV.LENDING_POOL_ADDRESS,
  LENDING_POOL_ABI,
  rpcProvider,
);

export const getStakedPerUser = async (
  account: string,
  options: Record<string, any>,
): Promise<number> => {
  const balance = await lendingPoolContract.totalStakedPerUsers(account, {
    ...options,
  });
  return Number(ethers.formatEther(balance));
};

export const getTotalStaked = async (options: Record<string, any>) => {
  const balance = await lendingPoolContract.totalStake({ ...options });
  return ethers.formatUnits(balance, 18);
};

export const getBlockNumber = async () => {
  return rpcProvider.getBlockNumber();
};
