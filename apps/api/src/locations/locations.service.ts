import { Injectable, BadRequestException } from '@nestjs/common';
import { request } from 'undici';
import type { LocationDTO } from '@weather/shared';
import { RedisService } from '../redis/redis.service';

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code?: string;
    state?: string;
    postcode?: string;
  };
};

@Injectable()
export class LocationsService {
  constructor(private readonly redis: RedisService) {}

  private cacheKey(q: string) {
    return `geocode:nominatim:${q.toLowerCase().trim()}`;
  }

  async search(q: string): Promise<{ results: LocationDTO[] }> {
    const query = (q ?? '').trim();
    if (query.length < 2) {
      throw new BadRequestException({ code: 'BAD_QUERY', message: 'Query must be at least 2 characters' });
    }

    // Try cache first (24h)
    const key = this.cacheKey(query);
    const client = await this.redis.getClient();
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);

    const userAgent = process.env.GEOCODE_USER_AGENT || 'weather-app';

    // Nominatim search (no key required)
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '8');

    const res = await request(url.toString(), {
      method: 'GET',
      headers: {
        'user-agent': userAgent,
        'accept-language': 'en',
      },
      // conservative timeouts
      bodyTimeout: 4000,
      headersTimeout: 4000,
    });

    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new BadRequestException({ code: 'GEOCODE_FAILED', message: `Geocoding failed (${res.statusCode})` });
    }

    const data = (await res.body.json()) as NominatimResult[];

    const results: LocationDTO[] = data.map((x) => ({
      id: `nominatim:${x.place_id}`,
      name: x.display_name,
      lat: Number(x.lat),
      lon: Number(x.lon),
      countryCode: x.address?.country_code?.toUpperCase(),
      adminArea: x.address?.state,
      postalCode: x.address?.postcode,
    }));

    const payload = { results };

    await client.set(key, JSON.stringify(payload), { EX: 60 * 60 * 24 });
    return payload;
  }
}
