import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { verifySignature } from '../utils/signature';
import { getStakedPerUser } from '../utils/lending-pool';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './reposities/vote.reposity';
import { Order } from './../orders/reposities/order.reposity';
const sha256 = require('simple-sha256');

@Injectable()
export class VotesService {
  constructor(private readonly vote: Vote, private readonly order: Order) {}

  async create(createVoteDto: CreateVoteDto) {
    const bytes = new TextEncoder().encode(
      JSON.stringify({
        voter: createVoteDto.voter,
        orderHash: createVoteDto.orderHash,
        isAccepted: createVoteDto.isAccepted,
      }),
    );

    const voteHash = await sha256(bytes);

    if (
      !verifySignature(createVoteDto.voter, voteHash, createVoteDto.signature)
    ) {
      throw new UnauthorizedException();
    }

    const currentOrder = await this.order.getByKey(createVoteDto.orderHash);
    if (currentOrder.lender !== 'pool') {
      throw new BadRequestException();
    }

    const currentVote = currentOrder.vote;
    const stakedPerUser = await getStakedPerUser(createVoteDto.voter, {
      blockTag: currentOrder.vote.blockNumber,
    });

    if (stakedPerUser === 0) {
      throw new UnauthorizedException();
    }

    if (createVoteDto.isAccepted) {
      currentVote.accepted = Number(currentVote.accepted) + stakedPerUser;
    } else {
      currentVote.rejected = Number(currentVote.rejected) + stakedPerUser;
    }

    await Promise.all([
      this.vote.create(voteHash, {
        ...createVoteDto,
        staked: stakedPerUser,
        hash: voteHash,
        createdAt: new Date().getTime(),
      }),
      this.order.update(createVoteDto.orderHash, { vote: currentVote }),
    ]);
    return currentVote;
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.vote.find(conditions);
  }

  async findById(id: string) {
    return await this.vote.getByKey(id);
  }

  async findByVoter(creator: string) {
    return await this.vote.find({ creator });
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
