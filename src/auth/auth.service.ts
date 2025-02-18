import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    // find if user exists by email
    const user = await this.UserModel.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // compare entered password with existing password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // generate access token and refresh token
    return this.generateUserToken(user._id);
  }

  async generateUserToken(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '2h' });

    return {
      accessToken,
    };
  }

  async refresh(refreshDto: any) {
    return refreshDto;
  }
}
