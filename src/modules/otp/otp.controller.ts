import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { UUID } from 'crypto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get(':phone')
  create(@Param('phone') phone: string) {
    return this.otpService.generateOtp(phone);
  }

  @Post()
  verifyOtp(@Body() body: { otp: string, uuid: UUID }) {
    return this.otpService.verifyOtp(+body.otp, body.uuid)
  }
}
