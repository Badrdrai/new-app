import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AbstractRepository } from './../../common/database/abstract.repository';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
    super(repo);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }
}
