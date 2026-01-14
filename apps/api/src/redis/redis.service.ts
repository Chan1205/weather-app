import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error('REDIS_URL is not set');
    this.client = createClient({ url });

    this.client.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('Redis error:', err);
    });
  }

  async getClient(): Promise<RedisClientType> {
    if (!this.client.isOpen) await this.client.connect();
    return this.client;
  }

  async ping(): Promise<string> {
    const c = await this.getClient();
    return c.ping();
  }

  async onModuleDestroy() {
    if (this.client.isOpen) await this.client.quit();
  }
}
