import { Module } from '@nestjs/common';
import { ConnectionsModule } from './connections/connections.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OffersModule } from './modules/offers/offers.module';
import { NftsModule } from './modules/nfts/nfts.module';
import { VotesModule } from './modules/votes/votes.module';
import { DacsModule } from './modules/dacs/dacs.module';
import { LendingPoolModule } from './modules/lending-pool/lending-pool.module';

@Module({
  imports: [
    ConnectionsModule,
    OrdersModule,
    OffersModule,
    NftsModule,
    VotesModule,
    DacsModule,
    LendingPoolModule,
  ],
  providers: [ConnectionsModule],
})
export class AppModule {}
