
import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  FindManyOptions,
  ObjectLiteral,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async findOneOrFail(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.repository.findOne({ where });
    if (!entity) throw new NotFoundException('Entity not found');
    return entity;
  }

  async findOneOrNull(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async update(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findOneOrFail(where);
    Object.assign(entity, data);
    return this.repository.save(entity);
  }

  async delete(where: FindOptionsWhere<T>): Promise<void> {
    const result = await this.repository.delete(where);
    if (result.affected === 0) throw new NotFoundException('Entity not found');
  }

  async findAndCount(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }
  async getById(id: number ): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
    if (!entity) throw new NotFoundException(`Entity with ID ${id} not found`);
    return entity;
  }
}
