import { Injectable } from '@nestjs/common';
import { User } from '@app/common'
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {

    constructor(private readonly cs:ConfigService,private readonly jwtSer:JwtService){}

    async login(user:User,res:Response)
    {
        const tokenPayload :TokenPayload = {
            userId: user.id
        }
        const expires = new Date();
        expires.setSeconds(
        expires.getSeconds() + this.cs.get('JWT_EXPIRATION')
        );
        const token = this.jwtSer.sign(tokenPayload);
        res.cookie('Authentication',token,{
        expires,
        httpOnly:true,
        });
        return token
    }

}
