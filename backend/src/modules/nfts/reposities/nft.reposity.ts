import { Injectable, Logger } from '@nestjs/common';
import { VoteRedisService } from 'src/connections/redis/vote.redis.provider';
import { SyncNftDto } from '../dto/sync-nft.dto';
const sha256 = require('simple-sha256');

const DATABASE_NAME = 'Nfts';

@Injectable()
export class Nft {
  public logger: Logger = new Logger(Nft.name);

  constructor(private readonly redisService: VoteRedisService) {}

  async getAll(): Promise<any[]> {
    const queryData = await this.redisService.hgetall(DATABASE_NAME);
    if (!queryData) return [];

    const dataInJSON = Object.values(queryData);
    return dataInJSON.map((item) => JSON.parse(item));
  }

  async getByKey(key: string): Promise<any> {
    const queryData = await this.redisService.hget(DATABASE_NAME, key);
    if (!queryData) return;

    return JSON.parse(queryData.toString());
  }

  async find(filters: any): Promise<any[]> {
    const offers = await this.getAll();
    if (!filters || Object.keys(filters).length === 0) return offers;

    return offers.filter((item) => {
      for (let key in filters) {
        if (item[key] === undefined || !filters[key].includes(item[key]))
          return false;
      }
      return true;
    });
  }

  async sync(data: SyncNftDto): Promise<boolean> {
    try {
      await this.redisService.hset(
        `${DATABASE_NAME}:${data.collectionAddress}`,
        data.tokenId.toString(),
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
