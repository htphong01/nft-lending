import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import {
  verifySignature,
  generateOfferMessage,
  generateRequestMessage,
} from '../utils/signature';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestStatus } from './dto/request.enum';
import { Request } from './reposities/request.reposity';
import { Order } from '../orders/reposities/order.reposity';
import { DacsService } from '../dacs/dacs.service';
// import * as FACTORY_ABI from './abi/LOAN.json';

@Injectable()
export class RequestsService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private nftContract: Contract;

  constructor(
    private readonly request: Request,
    private readonly order: Order,
    private readonly dacs: DacsService,
  ) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    // this.nftContract = new Contract(
    //   config.ENV.COLLECTION_ADDRESS,
    //   FACTORY_ABI,
    //   this.rpcProvider,
    // );
  }

  async create(dto: CreateRequestDto) {
    const requestHash = generateRequestMessage(
      dto,
      dto.signature,
      config.ENV.LOAN_ADDRESS,
      config.ENV.CHAIN_ID,
    );
    if (
      !verifySignature(
        dto.creator,
        ethers.getBytes(requestHash),
        dto.signature.signature,
      )
    ) {
      throw new UnauthorizedException();
    }
    const newRequest: Record<string, any> = {
      ...dto,
      // floorPrice: (createOfferDto.offer * 1.1).toFixed(2),
      creator: dto.creator,
      hash: requestHash,
      status: RequestStatus.OPENING,
      createdAt: new Date().getTime(),
    };
    const dacs_cid = await this.dacs.upload(newRequest);
    newRequest.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;
    await this.request.create(requestHash, newRequest);
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.request.find(conditions);
  }
}
