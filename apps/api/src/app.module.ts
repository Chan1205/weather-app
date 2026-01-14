import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { HealthController } from './health.controller';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [RedisModule, LocationsModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
