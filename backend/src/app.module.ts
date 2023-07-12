import { Module } from '@nestjs/common';
import { ConnectionsModule } from './connections/connections.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OffersModule } from './modules/offers/offers.module';
import { NftsModule } from './modules/nfts/nfts.module';
import { VotesModule } from './modules/votes/votes.module';
import { IpfsModule } from './modules/ipfs/ipfs.module';

@Module({
  imports: [ConnectionsModule, OrdersModule, OffersModule, NftsModule, VotesModule, IpfsModule],
  providers: [ConnectionsModule],
})
export class AppModule {}
