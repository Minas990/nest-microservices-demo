
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(
        private readonly cs : ConfigService ,
        private readonly userService: UsersService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([
                (req: any) => {
                    return req?.cookies?.Authentication || req?.Authentication
                }
            ]),
            secretOrKey: cs.get('JWT_SECRET') as string
        })
    }

    async validate({userId}:TokenPayload) //the token payload
    {
        return this.userService.getUser({_id:userId});
    }

}