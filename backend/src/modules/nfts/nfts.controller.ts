import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { ImportTokenDto } from './dto/import-token.dto';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Get()
  findAll(@Query() conditions: Record<string, string>) {
    return this.nftsService.findAll(conditions);
  }

  @Post("import")
  importToken(@Body() importTokenDto: ImportTokenDto) {
    return this.nftsService.importToken(importTokenDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.offersService.findById(id);
  // }

  // @Get('creator/:address')
  // findByCreator(@Param('address') address: string) {
  //   return this.offersService.findByCreator(address);
  // }
}
