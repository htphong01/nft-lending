import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { DacsModule } from '../dacs/dacs.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ConnectionsModule, ReposityModule, DacsModule, OrdersModule],
  exports: [RequestsService],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
