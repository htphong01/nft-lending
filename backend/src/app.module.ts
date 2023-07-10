import { Module } from '@nestjs/common';
import { ConnectionsModule } from './connections/connections.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OffersModule } from './modules/offers/offers.module';
import { NftsModule } from './modules/nfts/nfts.module';

@Module({
  imports: [ConnectionsModule, OrdersModule, OffersModule, NftsModule],
  providers: [ConnectionsModule],
})
export class AppModule {}
