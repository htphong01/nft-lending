import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  imports: [ConnectionsModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
