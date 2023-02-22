import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}
  @Post('/signin')
  signin(@Body() dto: any) {
    const { username, password } = dto;
    return this.authSevice.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    return this.authSevice.signup(username, password);
  }
}
