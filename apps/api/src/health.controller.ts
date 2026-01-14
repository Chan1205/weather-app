import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(private readonly redis: RedisService) {}

  @Get()
  async health() {
    let redis = 'down';
    try {
      const pong = await this.redis.ping();
      redis = pong === 'PONG' ? 'up' : pong;
    } catch {
      redis = 'down';
    }

    return {
      ok: true,
      redis,
      timestamp: new Date().toISOString(),
    };
  }
}
