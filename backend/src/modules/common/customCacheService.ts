import { ConfigService } from '@config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomCacheService<T> {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly configService: ConfigService,
    @Inject('CACHE_KEY')
    private readonly key: string,
  ) {}

  async getCachedData(): Promise<T[]> {
    return (await this.cacheManager.get(this.key)) as T[];
  }

  async getItemFromCachedData(id: string): Promise<T | null> {
    const cachedData = await this.getCachedData();
    if (!cachedData) return null;

    return cachedData.find((i: any) => i.id === id);
  }

  async setDataToCache(data: T[]): Promise<void> {
    await this.cacheManager.set(this.key, data, this.configService.cacheTTL);
  }

  async addNewDataToCache(data: T): Promise<void> {
    let cachedData = await this.getCachedData();
    cachedData = cachedData ? [data, ...cachedData] : [data];

    await this.setDataToCache(cachedData);
  }

  async updateExistingDataInCache(id: string, updatedData: T): Promise<void> {
    const cachedData = await this.getCachedData();
    if (!cachedData) {
      return this.addNewDataToCache(updatedData);
    }

    const dataIdx = cachedData.findIndex((i: any) => i.id === id);
    if (dataIdx === -1) return;

    cachedData[dataIdx] = updatedData;
    await this.setDataToCache(cachedData);
  }

  async deleteDataFromCache(id: string) {
    let cachedData = await this.getCachedData();
    if (!cachedData) return;

    cachedData = cachedData.filter((i: any) => i.id !== id);
    this.setDataToCache(cachedData);
  }
}
