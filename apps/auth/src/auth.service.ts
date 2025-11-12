import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { GetUserDto } from './users/dto/get-user.dto';

@Injectable()
export class AuthService {

    constructor(private readonly cs:ConfigService,private readonly jwtSer:JwtService){}

    async login(user:UserDocument,res:Response)
    {
        const tokenPayload :TokenPayload = {
        userId: user._id.toString()
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
    }

}
