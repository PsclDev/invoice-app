import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AppTypes } from '@utils';

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
