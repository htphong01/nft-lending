import { Injectable, Logger } from '@nestjs/common';
import { OrderRedisService } from 'src/connections/redis/order.redis.provider';
const sha256 = require('simple-sha256');

const DATABASE_NAME = 'Offers';

@Injectable()
export class Offer {
  public logger: Logger = new Logger(Offer.name);

  constructor(private readonly redisService: OrderRedisService) {}

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

  async create(
    orderHash: string,
    offerHash: string,
    data: any,
  ): Promise<boolean> {
    try {
      await this.redisService.hset(
        DATABASE_NAME,
        offerHash,
        JSON.stringify(data),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async update(id: string, data: any): Promise<boolean> {
    try {
      await this.redisService.hset(DATABASE_NAME, id, JSON.stringify(data));
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}