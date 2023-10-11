import { RequestsService } from './requests.service';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, string>) {
    return this.requestsService.findAll(conditions);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.requestsService.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.offersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.offersService.remove(+id);
  // }
}
