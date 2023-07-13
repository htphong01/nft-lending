import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OrdersController } from './offers.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { DacsModule } from '../dacs/dacs.module';

@Module({
  imports: [ConnectionsModule, ReposityModule, DacsModule],
  exports: [OffersService],
  controllers: [OrdersController],
  providers: [OffersService],
})
export class OffersModule {}
