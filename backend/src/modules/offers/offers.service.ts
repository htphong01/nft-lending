import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferStatus } from './dto/offer.enum';
import { UpdateOrderDto } from './dto/update-offer.dto';
import { Offer } from './reposities/offer.reposity';
import { verifySignature } from '../utils/signature';
const sha256 = require('simple-sha256');

@Injectable()
export class OffersService {
  constructor(private readonly offer: Offer) {}

  async create(createOfferDto: CreateOfferDto) {
    const bytes = new TextEncoder().encode(
      JSON.stringify({
        creator: createOfferDto.creator,
        order: createOfferDto.order,
        offer: createOfferDto.offer,
        duration: createOfferDto.duration,
        rate: createOfferDto.rate,
      }),
    );
    const offerHash = await sha256(bytes);

    if (
      !verifySignature(
        createOfferDto.creator,
        offerHash,
        createOfferDto.signature,
      )
    ) {
      throw new UnauthorizedException();
    }

    await this.offer.create(createOfferDto.order, offerHash, {
      ...createOfferDto,
      floorPrice: (createOfferDto.offer * 1.1).toFixed(2),
      hash: offerHash,
      status: OfferStatus.OPENING,
      createdAt: new Date().getTime(),
    });
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.offer.find(conditions);
  }

  async findById(id: string) {
    return await this.offer.getByKey(id);
  }

  async findByCreator(creator: string) {
    return await this.offer.find({ creator });
  }

  async findByOrder(order: string) {
    return await this.offer.getAll(order);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
