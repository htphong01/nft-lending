import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import { verifySignature, generateOfferMessage } from '../utils/signature';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferStatus } from './dto/offer.enum';
import { OrderStatus } from '../orders/dto/order.enum';
import { Offer } from './reposities/offer.reposity';
import { Order } from '../orders/reposities/order.reposity';
import { DacsService } from '../dacs/dacs.service';
import * as FACTORY_ABI from './abi/LOAN.json';

@Injectable()
export class RequestsService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private nftContract: Contract;

  constructor(
    private readonly offer: Offer,
    private readonly order: Order,
    private readonly dacs: DacsService,
  ) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.nftContract = new Contract(
      config.ENV.COLLECTION_ADDRESS,
      FACTORY_ABI,
      this.rpcProvider,
    );
  }

  async create(createOfferDto: CreateOfferDto) {
    const offerHash = generateOfferMessage(
      createOfferDto,
      createOfferDto.signature,
      config.ENV.LOAN_ADDRESS,
      config.ENV.CHAIN_ID,
    );

    if (
      !verifySignature(
        createOfferDto.creator,
        ethers.getBytes(offerHash),
        createOfferDto.signature.signature,
      )
    ) {
      throw new UnauthorizedException();
    }

    const newOffer: Record<string, any> = {
      ...createOfferDto,
      floorPrice: (createOfferDto.offer * 1.1).toFixed(2),
      hash: offerHash,
      status: OfferStatus.OPENING,
      // createdAt: new Date().getTime(),
    };

    const dacs_cid = await this.dacs.upload(newOffer);
    newOffer.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;

    await this.offer.create(createOfferDto.order, offerHash, newOffer);
  }
}
