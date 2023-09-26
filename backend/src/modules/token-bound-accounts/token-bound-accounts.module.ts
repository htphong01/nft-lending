import { Module } from '@nestjs/common';
import { TokenBoundAccountsService } from './token-bound-accounts.service';
import { TokenBoundAccountsController } from './token-bound-accounts.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { NftsModule } from '../nfts/nfts.module';
import { DacsModule } from '../dacs/dacs.module';
import { LendingPoolModule } from '../lending-pool/lending-pool.module';

@Module({
  imports: [
    ConnectionsModule,
    ReposityModule,
    NftsModule,
    DacsModule,
    LendingPoolModule,
  ],
  exports: [ReposityModule, TokenBoundAccountsService],
  controllers: [TokenBoundAccountsController],
  providers: [TokenBoundAccountsService],
})
export class TokenBoundAccountsModule {}
