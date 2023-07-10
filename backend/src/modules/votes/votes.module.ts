import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [ConnectionsModule, ReposityModule],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
