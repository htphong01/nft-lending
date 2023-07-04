import { Module } from '@nestjs/common';
import { ConnectionsModule } from './connections/connections.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConnectionsModule,
    OrdersModule
  ],
  providers: [
    ConnectionsModule
  ]
})
export class AppModule {}
