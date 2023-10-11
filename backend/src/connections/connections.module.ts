import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderRedisService } from './redis/order.redis.provider';
import { RequestRedisService } from './redis/request.redis.provider';
import { VoteRedisService } from './redis/vote.redis.provider';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [VoteRedisService, OrderRedisService, RequestRedisService],
  exports: [
    VoteRedisService,
    OrderRedisService,
    RequestRedisService,
    EventEmitterModule,
  ],
})
export class ConnectionsModule {}
