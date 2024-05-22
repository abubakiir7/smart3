import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Otp } from './entities/otp.entity';

@Module({
  imports: [SequelizeModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
