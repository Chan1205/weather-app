import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { HealthController } from './health.controller';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [RedisModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
