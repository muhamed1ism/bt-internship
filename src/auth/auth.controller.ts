import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { GetUser } from './decorator/get-user.decorator';
import { User } from 'src/user/type/user.type';
import { FirebaseJwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('current-user')
  @UseGuards(FirebaseJwtGuard)
  currentUser(@GetUser() user: User) {
    return user;
  }
}
