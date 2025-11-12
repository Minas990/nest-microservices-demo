import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common'
import * as Joi from 'joi';

@Module({
  imports: [
        ConfigModule.forRoot({
            isGlobal:true,
            validationSchema: Joi.object({
                PORT:Joi.number().required(),
                SMPT_USER:Joi.string().required(),
                GOOGLE_OAUTH_CLIENT_ID:Joi.string().required(),
                GOOGLE_OAUTH_CLIENT_SECRET:Joi.string().required(),
                GOOGLE_OAUTH_REFRESH_TOKEN:Joi.string().required()
            }),
            envFilePath:'./apps/notifications/.env'
        }),
        LoggerModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
