import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginUserDto, @Req() req: Request) {
    return this.authService.login(dto, {
      method: req.method,
      url: req.originalUrl,
    });
  }

  @Post('register')
  register(@Body() dto: CreateUserDto, @Req() req: Request) {
    return this.authService.register(dto, {
      method: req.method,
      url: req.originalUrl,
    });
  }
}
