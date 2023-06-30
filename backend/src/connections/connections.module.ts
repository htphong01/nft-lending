import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderRedisService } from './redis/order.redis.provider';
import { WebRedisService } from './redis/vote.redis.provider';

@Module({
  imports: [
    EventEmitterModule.forRoot()
  ],
  providers: [
    WebRedisService,
    OrderRedisService
  ],
  exports: [
    WebRedisService,
    OrderRedisService,
    EventEmitterModule
  ],
})
export class ConnectionsModule {}
