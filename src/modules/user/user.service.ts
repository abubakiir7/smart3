import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { generateOTP } from '../../helpers/otp-generator';
import { log } from 'console';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private usersRepo: typeof User) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepo.create(createUserDto);
  }

  findAll() {
    return this.usersRepo.findAll({});
  }

  findOne(id: number) {
    return this.usersRepo.findByPk(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updated_data = this.usersRepo.update(updateUserDto, { where: { id: id } });
    return {
      status: "success",
      messgae: "the user updated successfully",
      updated_data
    }
  }
 

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async phone_is_exists(id: number) {
    return (await this.usersRepo.findByPk(id))?.phone != null;
  }

  async email_is_exists(id: number) {
    return (await this.usersRepo.findByPk(id))?.email != null
  }
}
