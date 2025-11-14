import { Controller, Post, Body, Get, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import type { Response } from 'express';
import * as QRCode from 'qrcode';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
  ): Promise<User> {
    return this.userService.registerUser(name, email);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('qrcode')
async getQrCode(
  @Query('name') name: string,
  @Query('age') age: string,
  @Res() res: Response,
) {
  try {
    const jsonData = JSON.stringify({ name, age });
    const pcIp = '192.168.137.214'; // <-- your PC IP here
    const pageUrl = `http://${pcIp}:3000/users/show?data=${encodeURIComponent(jsonData)}`;

    const qrBuffer = await QRCode.toBuffer(pageUrl, { type: 'png' });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="qrcode.png"');
    res.send(qrBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}


@Get('show')
async showInfo(@Query('data') data: string, @Res() res: Response) {
  const parsed = JSON.parse(data);
  res.send(`
    <html>
      <head><title>QR Info</title></head>
      <body style="background:black;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;">
        <pre style="font-size:20px;">${JSON.stringify(parsed, null, 2)}</pre>
      </body>
    </html>
  `);
}

}
