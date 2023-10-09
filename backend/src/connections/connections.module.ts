import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderRedisService } from './redis/order.redis.provider';
import { VoteRedisService } from './redis/vote.redis.provider';
import { ItemRedisService } from './redis/item.redis.provider';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [VoteRedisService, OrderRedisService, ItemRedisService],
  exports: [
    VoteRedisService,
    OrderRedisService,
    ItemRedisService,
    EventEmitterModule,
  ],
})
export class ConnectionsModule {}
