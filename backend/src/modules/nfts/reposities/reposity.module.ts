import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Nft } from './nft.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [Nft],
  exports: [Nft],
})
export class ReposityModule {}
