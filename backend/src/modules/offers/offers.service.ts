import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import { createOfferMessage, hashOfferMessage, verifySignature } from '../utils/signature';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferStatus } from './dto/offer.enum';
import { OrderStatus } from '../orders/dto/order.enum';
import { Offer } from './reposities/offer.reposity';
import { Order } from '../orders/reposities/order.reposity';
import { DacsService } from '../dacs/dacs.service';
import * as FACTORY_ABI from './abi/LOAN.json';
import { Request } from '../requests/reposities/request.reposity';
import { ONE_DAY, WXCR_DECIMALS } from '../utils/constants';
import { UpdateOrderDto } from './dto/update-offer.dto';
import {
  DirectLoanFixedOffer,
  DirectLoanFixedOffer__factory,
  ERC721,
  ERC721__factory,
  LendingPool,
  LendingPool__factory,
} from 'src/typechain-types';
import { calculateRepayment } from '../utils/apr';

@Injectable()
export class OffersService implements OnModuleInit {
  update(arg0: number, updateOrderDto: UpdateOrderDto) {
    throw new Error('Method not implemented.');
  }
  private rpcProvider: JsonRpcProvider;
  private nftContract: ERC721;
  private lendingPoolContract: LendingPool;
  private loanContract: DirectLoanFixedOffer;

  private readonly logger: Logger = new Logger(OffersService.name);

  constructor(
    private readonly offer: Offer,
    private readonly order: Order,
    @Inject(forwardRef(() => Request))
    private readonly request: Request,
    private readonly dacs: DacsService,
  ) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.nftContract = ERC721__factory.connect(
      config.ENV.COLLECTION_ADDRESS,
      this.rpcProvider,
    );
    this.lendingPoolContract = LendingPool__factory.connect(
      config.ENV.LENDING_POOL_ADDRESS,
      this.rpcProvider,
    );
    this.loanContract = DirectLoanFixedOffer__factory.connect(
      config.ENV.LOAN_ADDRESS,
      this.rpcProvider,
    );
  }

  async create(createOfferDto: CreateOfferDto) {
    const repayment = calculateRepayment(
      createOfferDto.offer,
      createOfferDto.rate,
      createOfferDto.duration,
    );

    const offerMessage = createOfferMessage(
      {
        adminFeeInBasisPoints: createOfferDto.adminFeeInBasisPoints,
        duration: Number(createOfferDto.duration) * ONE_DAY,
        erc20Denomination: createOfferDto.erc20Denomination,
        maximumRepaymentAmount: ethers.parseUnits(repayment, 18),
        nftCollateralContract: createOfferDto.nftAddress,
        nftCollateralId: createOfferDto.nftTokenId,
        principalAmount: ethers.parseUnits(createOfferDto.offer, 18),
        lendingPool: createOfferDto.lendingPool,
      },
      createOfferDto.signature, // Created from client side
      this.loanContract.target,
      Number(config.ENV.CHAIN_ID),
    );
    const hashedOfferMessage = hashOfferMessage(offerMessage);

    if (
      !verifySignature(
        createOfferDto.creator,
        offerMessage,
        createOfferDto.signature.signature,
      )
    ) {
      throw new UnauthorizedException();
    }

    const newOffer: Record<string, any> = {
      ...createOfferDto,
      floorPrice: (Number(createOfferDto.offer) * 1.1).toFixed(2),
      hash: hashedOfferMessage,
      status: OfferStatus.OPENING,
      // createdAt: new Date().getTime(),
    };

    const dacs_cid = await this.dacs.upload(newOffer);
    newOffer.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;

    await this.offer.create(createOfferDto.order, hashedOfferMessage, newOffer);
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

  async handleEvents(rpcProvider: JsonRpcProvider, from: number, to: number) {
    try {
      const loanContract = new Contract(
        config.ENV.LOAN_ADDRESS,
        FACTORY_ABI,
        rpcProvider,
      );

      // Fetch events data
      const events = await loanContract.queryFilter('*', from, to);

      for (let i = 0; i < events.length; i++) {
        const event: any = events[i];

        if (!event) continue;
        if (Object.keys(event).length === 0) continue;
        if (!event.fragment) continue;

        switch (event.fragment.name) {
          case 'LoanStarted': {
            const loanId = event.args.loanId;
            const offer = await this.findById(loanId);
            if (offer) {
              await Promise.all([
                this.offer.update(loanId, { status: OfferStatus.FILLED }),
                this.offer.deleteAllAccept(loanId),
                this.order.update(offer.order, { status: OrderStatus.FILLED }),
              ]);
            } else {
              await this.order.update(loanId, { status: OrderStatus.FILLED });
            }

            break;
          }
          case 'LoanRepaid': {
            const loanId = event.args.loanId;
            const offer = await this.findById(loanId);
            if (offer) {
              await Promise.all([
                this.offer.update(loanId, { status: OfferStatus.REPAID }),
                this.order.update(offer.order, { status: OrderStatus.REPAID }),
              ]);
            } else {
              await this.order.update(loanId, { status: OrderStatus.REPAID });
            }

            break;
          }
          case 'LoanLiquidated': {
            const loanId = event.args.loanId;
            const offer = await this.findById(loanId);

            if (offer) {
              await Promise.all([
                this.offer.update(loanId, { status: OfferStatus.LIQUIDATED }),
                this.order.update(offer.order, {
                  status: OrderStatus.LIQUIDATED,
                }),
              ]);
            } else {
              await this.order.update(loanId, { status: OrderStatus.REPAID });
            }

            break;
          }

          case 'LoanRenegotiated':
            this.logger.log('LoanRenegotiated: ', event.args.loanId);
            const {
              loanId: offerId,
              newLoanDuration,
              renegotiationFee,
              renegotiationAdminFee,
            } = event.args;

            const loanDuration = newLoanDuration.toString() / ONE_DAY;
            const fee = ethers.formatUnits(
              renegotiationFee.toString(),
              WXCR_DECIMALS,
            );
            const adminFee = ethers.formatUnits(
              renegotiationAdminFee.toString(),
              WXCR_DECIMALS,
            );

            const offer = await this.offer.getByKey(offerId);
            if (offer) {
              await Promise.all([
                this.order.update(offer.order, {
                  duration: loanDuration,
                  renegotiationFee: fee,
                  renegotiationAdminFee: adminFee,
                }),
                this.request.deleteAllByOffer(offerId),
              ]);
            }

          default: {
            break;
          }
        }
      }
    } catch (error) {
      console.log('offer', error);
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async handleExpiredOffer() {
    try {
      this.offer.updateExpiredOffer();
    } catch (error) {
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
