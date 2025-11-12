import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common/logger';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService,ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
    imports: [
        UsersModule,
        LoggerModule,
        ConfigModule.forRoot({
            isGlobal:true,
            validationSchema: Joi.object({
                DATABASE_URI:Joi.string().required(),
                JWT_SECRET:Joi.string().required(),
                JWT_EXPIRATION:Joi.number().required(),
                HTTP_PORT:Joi.number().required()
            }),
            envFilePath:'./apps/auth/.env'
        }),
        JwtModule.registerAsync({
            useFactory:(cs:ConfigService)=>{
                return {
                    secret:cs.get('JWT_SECRET'),
                    signOptions:{
                        expiresIn:`${cs.get('JWT_EXPIRATION')}s`
                    }
                }
            },
            inject:[ConfigService],
        }),

    ],
    controllers: [AuthController],
    providers: [AuthService,LocalStrategy,JwtStrategy],
})
export class AuthModule {}
