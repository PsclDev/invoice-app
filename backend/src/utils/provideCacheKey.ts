import { CacheKeys } from '@utils';

export function ProvideCacheKey(key: CacheKeys): any {
  return {
    provide: 'CACHE_KEY',
    useValue: key,
  };
}
