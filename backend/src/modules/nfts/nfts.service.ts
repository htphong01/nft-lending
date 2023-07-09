import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit
} from "@nestjs/common";
import { Contract, JsonRpcProvider } from "ethers";
import { Nft } from "./reposities/nft.reposity";
import config from '../../config';

import * as FACTORY_ABI from "./abi/ERC721.json";

const DATABASE_NAME = 'collection';

@Injectable()
export class NftsService implements OnModuleInit {

  private rpcProvider: JsonRpcProvider;
  private nftContract: Contract;

  constructor(private readonly nft: Nft) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.nftContract = new Contract(
      config.ENV.COLLECTION_ADDRESS,
      FACTORY_ABI,
      this.rpcProvider
    );
  }

  // async getCollectionListByAddress(address: string) {
  //   try {
  //     // Initialize collection list with default collection
  //     const dèfaultCollection: CollectionResponseDTO[] = [{
  //       name: "SW3 Dapp Default Collection",
  //       symbol: "SW3DAPP",
  //       address: BLOCKCHAIN_CONFIG.COLLECTION_DEFAULT_ADDRESS,
  //       is_default: true
  //     }];

  //     // Retrieve all collections of the user
  //     const collectionKeys = await this.cacheService.keys(`${DATABASE_NAME}:${address.toLowerCase()}:*`);
  //     const requests = collectionKeys.map(key => this.cacheService.get(key))
  //     const data = await Promise.all(requests);
  //     if (!data) return dèfaultCollection;

  //     const collections: CollectionResponseDTO[] = data.map((item: CollectionResponseDTO) => {
  //       return {
  //         ...item,
  //         is_default: false
  //       }
  //     });
  //     return dèfaultCollection.concat(collections);
  //   } catch (error) {
  //     throw new HttpException(error.response.data, error.response.status);
  //   }
  // }

  async handleNftEvent() {
    try {
      // Calculate from block and to block
      const onChainLatestBlock = await this.rpcProvider.getBlockNumber();
      if (!onChainLatestBlock) {
        return;
      }

      let crawlLatestBlock = await this.nft.getByKey('crawlLatestBlock');
      if (!crawlLatestBlock || crawlLatestBlock === 0) {
        crawlLatestBlock = onChainLatestBlock - 15;
        await this.nft.create('crawlLatestBlock', crawlLatestBlock, {
          ttl: -1,
        });
      }

      let toBlock;
      if (onChainLatestBlock - 15 <= crawlLatestBlock) {
        toBlock = crawlLatestBlock;
      } else {
        toBlock = onChainLatestBlock - 15;
      }

      // Avoid error exceed maximum block range
      if (toBlock - crawlLatestBlock > 5000) {
        toBlock = crawlLatestBlock + 5000
      }

      // Fetch events data
      const events = await this.nftContract.queryFilter(
        'NFTDeployed',
        crawlLatestBlock,
        toBlock
      );

      // Update latest block
      await this.nft.create('crawlLatestBlock', toBlock, {
        ttl: -1,
      });

      // Retrieve all event informations
      if (!events || events.length === 0) return;
      for (let i = 0; i < events.length; i++) {
        const event = events[i];

        if (!event || event.blockNumber <= crawlLatestBlock) continue;
        if (Object.keys(event).length === 0) continue;

        // await this.setCollectionByAddress(String(event.args.deployer).toLowerCase(), {
        //   name: event.args.name,
        //   symbol: event.args.symbol,
        //   address: event.args.nft
        // });
      }
    } catch (error) {
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // async setCollectionByAddress(address: string, collection: Collection) {
  //   try {
  //     await this.cacheService.set(`${DATABASE_NAME}:${address}:${collection.address}`, collection, {
  //       ttl: REDIS_CONFIG.UNEXPIRED_TIME,
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.response.data, error.response.status);
  //   }
  // }
}