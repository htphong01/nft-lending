import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';

@Module({
  imports: [ConnectionsModule, ReposityModule],
  controllers: [NftsController],
  providers: [NftsService],
})
export class NftsModule {}
