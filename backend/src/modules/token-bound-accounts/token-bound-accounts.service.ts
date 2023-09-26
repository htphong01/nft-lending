import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import { CreateTokenBoundAccountDto } from './dto/create-token-bound-account.dto';
import { UpdateTokenBoundAccountDto } from './dto/update-token-bound-account.dto';
import { TokenBoundAccount } from './reposities/token-bound-account.reposity';
import * as ERC721_ABI from './abi/ERC721.json';

@Injectable()
export class TokenBoundAccountsService {
  private rpcProvider: JsonRpcProvider;

  constructor(private readonly tokenBoundAccount: TokenBoundAccount) {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
  }

  async create(createTokenBoundAccountDto: CreateTokenBoundAccountDto) {
    const {
      registryAddress,
      implementationAddress,
      tokenAddress,
      tokenId,
      salt,
    } = createTokenBoundAccountDto;

    const isExisted = await this.tokenBoundAccount.find({
      registryAddress,
      implementationAddress,
      tokenAddress,
      tokenId,
      salt,
    });

    if (isExisted.length > 0) {
      throw new ConflictException('Already imported');
    }

    const nftContract = new Contract(
      createTokenBoundAccountDto.tokenAddress,
      ERC721_ABI,
      this.rpcProvider,
    );

    const ownerOfTokenId = await nftContract.ownerOf(
      createTokenBoundAccountDto.tokenId,
    );

    if (
      ownerOfTokenId.toLowerCase() !==
      createTokenBoundAccountDto.owner.toLowerCase()
    ) {
      throw new UnauthorizedException('Caller is not owner of token Id');
    }

    const encodedTokenBoundAccount = ethers.solidityPacked(
      ['address', 'address', 'address', 'address', 'uint256', 'uint256'],
      [
        createTokenBoundAccountDto.owner,
        createTokenBoundAccountDto.registryAddress,
        createTokenBoundAccountDto.implementationAddress,
        createTokenBoundAccountDto.tokenAddress,
        createTokenBoundAccountDto.tokenId,
        createTokenBoundAccountDto.salt,
      ],
    );

    const tokenBoundAccountHash = ethers.keccak256(encodedTokenBoundAccount);
    this.tokenBoundAccount.create(tokenBoundAccountHash, {
      hash: tokenBoundAccountHash,
      ...createTokenBoundAccountDto,
    });
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.tokenBoundAccount.find(conditions);
  }

  async findById(id: string) {
    return await this.tokenBoundAccount.getByKey(id);
  }

  async findByOwner(owner: string) {
    return await this.tokenBoundAccount.find({ owner });
  }

  update(id: number, updateTokenBoundAccountDto: UpdateTokenBoundAccountDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
