import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { IpfsService } from './ipfs.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get(':cid')
  findOne(@Param('cid') cid: string) {
    return this.ipfsService.findByCid(cid);
  }
}
