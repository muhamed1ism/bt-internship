import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('google-signin')
  googleSignIn(@Headers('authorization') authHeader: string) {
    return this.authService.googleSignIn(authHeader);
  }

  @Post('google-register')
  googleRegister(
    @Headers('authorization') authHeader: string,
    @Body() dto: RegisterDto,
  ) {
    return this.authService.googleRegister(authHeader, dto);
  }
}
