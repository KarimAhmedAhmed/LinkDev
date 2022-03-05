import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,

  ) { }

  @Post('register')
  async register(@Body() RegisterDTO: RegisterDTO) {
    const user = await this.userService.create(RegisterDTO);
    const payload = {
      mobile: user.mobile,
      email: user.email
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }


}