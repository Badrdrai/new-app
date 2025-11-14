import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { QrCodeService } from '../qr-code/qr-code.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly qrService: QrCodeService,
  ) {}

  async registerUser(name: string, email: string): Promise<User> {
    const user = await this.userRepo.create({ name, email });

    const qrData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const qrCode = await this.qrService.generateQrCode(qrData);

    user.qrCode = qrCode;
    await this.userRepo.create(user);

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.getById(id)
  }

  async findByName(name: string): Promise<User> {
    const user = await this.userRepo.findOneOrNull({ name });
    if (!user) throw new NotFoundException(`User with name "${name}" not found`);
    return user;
  }
}
