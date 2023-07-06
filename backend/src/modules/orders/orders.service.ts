import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/order.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './reposities/order.reposity';
import { verifySignature } from '../utils/signature';
const sha256 = require('simple-sha256')

@Injectable()
export class OrdersService { 

  constructor(private readonly order: Order) { }

  async create(createOrderDto: CreateOrderDto) {
    const bytes = new TextEncoder().encode(JSON.stringify({
      creator: createOrderDto.creator,
      nftAddress: createOrderDto.nftAddress,
      nftTokenId: createOrderDto.nftTokenId,
      offer: createOrderDto.offer,
      duration: createOrderDto.duration,
      rate: createOrderDto.rate,
      lender: createOrderDto.lender
    }));
    const orderHash = await sha256(bytes);

    if (!verifySignature(
      createOrderDto.creator,
      orderHash,
      createOrderDto.signature
    )) {
      throw new UnauthorizedException();
    }

    await this.order.create(orderHash, {
      ...createOrderDto,
      floorPrice: (createOrderDto.offer * 1.1).toFixed(2),
      hash: orderHash,
      status: OrderStatus.OPENING,
      createdAt: new Date().getTime()
    });
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.order.find(conditions);
  }

  async findById(id: string) {
    return await this.order.getByKey(id);
  }

  async findByCreator(creator: string) {
    return await this.order.find({ creator });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
