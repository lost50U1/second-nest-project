import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async register(registerDto: any) {
    return registerDto;
  }

  async login(loginDto: any) {
    return loginDto;
  }

  async refresh(refreshDto: any) {
    return refreshDto;
  }
}
