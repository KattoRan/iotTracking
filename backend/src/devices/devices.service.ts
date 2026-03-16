import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register-device.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Check email tồn tại
      const existed = await tx.users.findUnique({
        where: { email: dto.email },
      });

      if (existed) {
        throw new ConflictException('Email already registered');
      }

      // 2. Create user
      const user = await tx.users.create({
        data: {
          full_name: dto.fullName,
          email: dto.email,
          address: dto.address,
          citizen_id: dto.citizenId,
        },
      });

      // 3. Create device
      const device = await tx.devices.create({
        data: {
          id: randomUUID(),
          user_id: user.id,
          model: dto.device.model,
          type: dto.device.type,
          device_os: dto.device.os,
          phone_number: dto.phoneNumber,
        },
      });

      return {
        userId: user.id,
        deviceId: device.id,
      };
    });
  }
}