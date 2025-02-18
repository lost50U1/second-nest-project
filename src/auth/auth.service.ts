import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async register(registerData: RegisterDto) {
    const { email, password, name } = registerData;

    // check if user already exists or email already exists
    const emailInUse = await this.UserModel.findOne({
      email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user document and save the user to the database
    await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async login(loginDto: any) {
    return loginDto;
  }

  async refresh(refreshDto: any) {
    return refreshDto;
  }
}
