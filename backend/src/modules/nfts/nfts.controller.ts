import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NftsService } from './nfts.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly offersService: NftsService) {}

  // @Get()
  // findAll(@Query() conditions: Record<string, string>) {
  //   return this.offersService.findAll(conditions);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.offersService.findById(id);
  // }

  // @Get('creator/:address')
  // findByCreator(@Param('address') address: string) {
  //   return this.offersService.findByCreator(address);
  // }
}
