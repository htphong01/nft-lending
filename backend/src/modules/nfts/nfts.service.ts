import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Contract, JsonRpcProvider } from 'ethers';
import { Nft } from './reposities/nft.reposity';
import { Crawl } from './reposities/crawl.reposity';
import config from 'src/config';
import * as FACTORY_ABI from './abi/ERC721.json';
import { SyncNftDto } from './dto/sync-nft.dto';

@Injectable()
export class NftsService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private nftContract: Contract;

  constructor(private readonly nft: Nft, private readonly crawl: Crawl) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.nftContract = new Contract(
      config.ENV.COLLECTION_ADDRESS,
      FACTORY_ABI,
      this.rpcProvider,
    );
  }

  async getNfts(address: string) {
    try {
      return {};
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async handleNftEvent() {
    try {
      // Calculate from block and to block
      const onChainLatestBlock = await this.rpcProvider.getBlockNumber();
      if (!onChainLatestBlock) {
        return;
      }

      let crawlLatestBlock = await this.crawl.getCrawlLatestBlock();
      if (!crawlLatestBlock || crawlLatestBlock === 0) {
        crawlLatestBlock = onChainLatestBlock - 1;
        await this.crawl.setCrawlLatestBlock(crawlLatestBlock);
      }

      let toBlock;
      if (onChainLatestBlock - 1 <= crawlLatestBlock) {
        toBlock = crawlLatestBlock;
      } else {
        toBlock = onChainLatestBlock - 1;
      }

      // Avoid error exceed maximum block range
      if (toBlock - crawlLatestBlock > 5000) {
        toBlock = crawlLatestBlock + 5000;
      }

      // Fetch events data
      const events = await this.nftContract.queryFilter(
        'Transfer',
        crawlLatestBlock,
        toBlock,
      );

      // Update latest block
      await this.crawl.setCrawlLatestBlock(toBlock);

      // Retrieve all event informations
      if (!events || events.length === 0) return;
      for (let i = 0; i < events.length; i++) {
        const event: any = events[i];
        if (!event) continue;
        if (Object.keys(event).length === 0) continue;

        const tokenId = Number(BigInt(event.args.tokenId).toString());

        let nftData = {
          owner: event.args.to.toLowerCase(),
          tokenId: tokenId,
          tokenURI: await this.nftContract.tokenURI(tokenId),
          collectionName: await this.nftContract.name(),
          collectionSymbol: await this.nftContract.symbol(),
          collectionAddress: event.address.toLowerCase(),
          isAvailable: true,
        };

        const existedNft = await this.findAll({
          tokenId: tokenId.toString(),
          collectionAddress: event.address.toLowerCase(),
        });

        if (existedNft.length > 0) {
          nftData = { ...existedNft[0], owner: event.args.to.toLowerCase() };
        }

        await this.syncNft(nftData);
      }
    } catch (error) {
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async syncNft(nftInfo: SyncNftDto) {
    try {
      await this.nft.sync(nftInfo);
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.nft.find(conditions);
  }
}
