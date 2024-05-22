import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { Otp } from './entities/otp.entity';
import { InjectModel } from '@nestjs/sequelize';
import { generateOTP } from '../../helpers/otp-generator';
import { addMinutesToDate } from '../../helpers/add-minutes';
import { log } from 'console';
import { UUID } from 'crypto';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp) private otpRepo: typeof Otp) {}
  async generateOtp(phone: string) {
    // generating otp
    const otp = generateOTP(4);
    const expiration_time = addMinutesToDate(new Date(), 1);
    this.otpRepo.destroy({ where: { phone } });
    this.otpRepo.create({ otp, expiration_time, phone });
    const saved_data = await this.otpRepo.create({ otp, expiration_time });
    // sending message
    return saved_data.id;
  }

  async verifyOtp(otp: number, uuid: UUID) {
    const saved_otp = await this.otpRepo.findOne({ where: { id: uuid } });
    log(saved_otp.expiration_time, new Date());
    // checking expiration date
    if (saved_otp.expiration_time < new Date())
      return { message: 'otp expired' };
    // checking otp
    if (saved_otp.otp !== otp) return { message: 'otp is not correct' };
    return { message: 'success' };
  }
}
