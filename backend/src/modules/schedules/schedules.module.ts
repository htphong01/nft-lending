import { NftsModule } from './../nfts/nfts.module';
import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { OffersModule } from '../offers/offers.module';

@Module({
  imports: [ConnectionsModule, ReposityModule, OffersModule, NftsModule],
  controllers: [],
  providers: [],
})
export class SchedulesModule {}
