import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal:true,
        validationSchema: Joi.object({
            PORT:Joi.number().required(),
            STRIPE_SECRET_KEY:Joi.string().required(),
            NOTIFICATIONS_PORT:Joi.number().required(),
            NOTIFICATIONS_HOST:Joi.string().required()
        }),
        envFilePath:'./apps/payment/.env'
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name:NOTIFICATIONS_SERVICE ,
        inject:[ConfigService],
        useFactory: (cs:ConfigService) => 
        {
          return {
            transport:Transport.TCP,
            options: {
              host:cs.get('NOTIFICATIONS_HOST'),
              port:cs.get('NOTIFICATIONS_PORT')
            },
          }
        }
      }
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
