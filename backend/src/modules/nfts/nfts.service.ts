import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contract, JsonRpcProvider } from 'ethers';
import axios from 'axios';
import { Nft } from './reposities/nft.reposity';
import config from 'src/config';
import { SyncNftDto } from './dto/sync-nft.dto';
import { ImportTokenDto } from './dto/import-token.dto';
import { ERC721, ERC721__factory } from './typechain';

@Injectable()
export class NftsService {
  private rpcProvider: JsonRpcProvider;
  private nftContractsMap: Record<string, ERC721> = {};

  constructor(private readonly nft: Nft) {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
  }

  async getNfts(address: string) {
    try {
      return {};
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async handleEvents(rpcProvider: JsonRpcProvider, from: number, to: number) {
    try {
      const nftContract = ERC721__factory.connect(
        config.ENV.COLLECTION_ADDRESS,
        rpcProvider,
      );
      // Fetch events data
      const events = await nftContract.queryFilter(
        nftContract.getEvent('Transfer'),
        from,
        to,
      );

      // Retrieve all event informations
      if (!events || events.length === 0) return;
      for (let i = 0; i < events.length; i++) {
        const event: any = events[i];
        if (!event) continue;
        if (Object.keys(event).length === 0) continue;

        const tokenId = Number(BigInt(event.args.tokenId).toString());

        const { data } = await axios.get(await nftContract.tokenURI(tokenId));

        const nftData = {
          owner: event.args.to.toLowerCase(),
          tokenId: tokenId,
          tokenURI: await nftContract.tokenURI(tokenId),
          collectionName: await nftContract.name(),
          collectionSymbol: await nftContract.symbol(),
          collectionAddress: event.address.toLowerCase(),
          metadata: data,
          isAvailable: true,
        };

        // const existedNft = await this.findAll({
        //   tokenId: tokenId.toString(),
        //   collectionAddress: event.address.toLowerCase(),
        // });

        // if (existedNft.length > 0) {
        //   nftData = {
        //     ...existedNft[0],
        //     isAvailable: true,
        //     owner: event.args.to.toLowerCase(),
        //   };
        // }

        await this.syncNft(nftData);
      }
    } catch (error) {
      console.log(error);
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

  async saveNft(owner: string, tokenId: number, collectionAddress: string) {
    const nftContract = ERC721__factory.connect(
      collectionAddress,
      this.rpcProvider,
    );

    const { data } = await axios.get(await nftContract.tokenURI(tokenId));

    const nftData = {
      owner: owner,
      tokenId: tokenId,
      tokenURI: await nftContract.tokenURI(tokenId),
      collectionName: await nftContract.name(),
      collectionSymbol: await nftContract.symbol(),
      collectionAddress: await nftContract.getAddress(),
      metadata: data,
      isAvailable: true,
    };

    await this.syncNft(nftData);
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.nft.find(conditions);
  }

  async importToken({ collectionAddress, owner, tokenId }: ImportTokenDto) {
    await this.saveNft(owner, tokenId, collectionAddress);
    await this.registerTransferEvent(collectionAddress);
    
    return { message: 'Imported successfully' };
  }

  async registerTransferEvent(collectionAddress: string) {
    if (this.nftContractsMap[collectionAddress]) return;

    const nftContract = ERC721__factory.connect(
      collectionAddress,
      this.rpcProvider,
    );

    await nftContract.on(
      nftContract.getEvent('Transfer'),
      async (from, to, currentTokenId) => {
        await this.saveNft(to, Number(currentTokenId), collectionAddress);
        console.log(`Transfered ${currentTokenId} from ${from} to ${to}`);
      },
    );

    this.nftContractsMap[collectionAddress] = nftContract;
  }
}
