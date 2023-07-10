import { Injectable, UnauthorizedException } from '@nestjs/common';
import sha256 from 'simple-sha256';
import { verifySignature } from '../utils/signature';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './reposities/vote.reposity';

@Injectable()
export class VotesService {
  constructor(private readonly vote: Vote) {}

  async create(createVoteDto: CreateVoteDto) {
    const bytes = new TextEncoder().encode(
      JSON.stringify({
        voter: createVoteDto.voter,
        oderHash: createVoteDto.orderHash,
        isAccepted: createVoteDto.isAccepted,
      }),
    );

    const voteHash = await sha256(bytes);

    if (
      !verifySignature(createVoteDto.voter, voteHash, createVoteDto.signature)
    ) {
      throw new UnauthorizedException();
    }

    await this.vote.create(voteHash, {
      ...createVoteDto,
      hash: voteHash,
      createdAt: new Date().getTime(),
    });
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
