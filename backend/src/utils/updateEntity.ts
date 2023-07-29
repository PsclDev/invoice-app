import { NotFoundException } from '@nestjs/common';
import { AppTypes } from '@utils';
import { Repository } from 'typeorm';

export async function updateEntity<T = AppTypes>(
  repository: Repository<T>,
  id: string,
  dto: any,
) {
  const result = await repository.update(id, dto);

  if (result.affected <= 0) {
    throw new NotFoundException();
  }
}
