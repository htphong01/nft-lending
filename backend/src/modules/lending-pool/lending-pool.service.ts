/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import * as FACTORY_ABI from './abi/LendingPool.json';

@Injectable()
export class LendingPoolService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private lendingPoolContract: Contract;

  constructor() {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.lendingPoolContract = new Contract(
      config.ENV.LENDING_POOL_ADDRESS,
      FACTORY_ABI,
      this.rpcProvider,
    );
  }

  async getStakedPerUser(
    account: string,
    options: Record<string, any>,
  ): Promise<number> {
    const balance = await this.lendingPoolContract.totalStakedPerUsers(
      account,
      {
        ...options,
      },
    );
    return Number(ethers.formatEther(balance));
  }

  async getTotalStaked(options: Record<string, any>) {
    const balance = await this.lendingPoolContract.totalStake({ ...options });
    return ethers.formatUnits(balance, 18);
  }

  async getBlockNumber() {
    return this.rpcProvider.getBlockNumber();
  }
}
