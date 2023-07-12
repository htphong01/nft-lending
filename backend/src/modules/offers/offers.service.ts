import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import config from 'src/config';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferStatus } from './dto/offer.enum';
import { UpdateOrderDto } from './dto/update-offer.dto';
import { Offer } from './reposities/offer.reposity';
import { verifySignature } from '../utils/signature';
import { DacsService } from '../dacs/dacs.service';
const sha256 = require('simple-sha256');

@Injectable()
export class OffersService {
  constructor(
    private readonly offer: Offer,
    private readonly dacs: DacsService,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    const bytes = new TextEncoder().encode(
      JSON.stringify({
        creator: createOfferDto.creator,
        order: createOfferDto.order,
        borrower: createOfferDto.borrower,
        offer: createOfferDto.offer,
        duration: createOfferDto.duration,
        rate: createOfferDto.rate,
        expiration: createOfferDto.expiration,
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

    const newOffer: Record<string, any> = {
      ...createOfferDto,
      floorPrice: (createOfferDto.offer * 1.1).toFixed(2),
      hash: offerHash,
      status: OfferStatus.OPENING,
      createdAt: new Date().getTime(),
    };

    const dacs_cid = await this.dacs.upload(newOffer);
    newOffer.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;

    await this.offer.create(createOfferDto.order, offerHash, newOffer);
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
    return await this.offer.find({ order });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
