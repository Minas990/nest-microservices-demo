import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

import  { type Response}  from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser,User } from '@app/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @CurrentUser() user:User,
        @Res({passthrough:true}) res:Response
    )
    {
        const jwt = await this.authService.login(user,res);
        res.send(jwt);
    }

    @UseGuards(JwtAuthGuard)
    @MessagePattern('authenticate')
    async authenticate
    (
        @Payload() data:any
    )
    {
        return data.user;
    }
}
