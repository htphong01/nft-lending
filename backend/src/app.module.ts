import { Module } from '@nestjs/common';
import { ConnectionsModule } from './connections/connections.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OffersModule } from './modules/offers/offers.module';

@Module({
  imports: [ConnectionsModule, OrdersModule, OffersModule],
  providers: [ConnectionsModule],
})
export class AppModule {}
