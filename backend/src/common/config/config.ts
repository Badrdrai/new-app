import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost' ,
  port:   5432 ,
  username: "root" ,
  password: 'password' ,
  database: "mydb" ,
  entities: [User],
  synchronize: true,}
