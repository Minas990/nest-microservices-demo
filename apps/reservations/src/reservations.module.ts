import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { DatabaseModule } from '@app/common';
import { Reservation } from './models/reservations.entity';
import { LoggerModule } from '@app/common/logger';
import { ReservationRepository } from './reservations.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants/services';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: Joi.object({
        DATABASE_URI:Joi.string().required(),
        PORT:Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        PAYMENT_HOST: Joi.string().required(),
        AUTH_PORT:Joi.number().required(),
        PAYMENT_PORT:Joi.number().required(),
      }),
      envFilePath:['./apps/reservations/.env','.env']
      // envFilePath:'./apps/reservations/.env',
      
    }),
    ClientsModule.registerAsync([
      {
        name:AUTH_SERVICE,
        useFactory: (cs:ConfigService) => 
        {
          return {
            transport:Transport.TCP,
            options:{
              host:cs.get('AUTH_HOST'),
              port:cs.get('AUTH_PORT')
            },
          }
        },
        inject:[ConfigService]
      },
      {
        name:PAYMENTS_SERVICE,
        useFactory: (cs:ConfigService) => 
        {
          return {
            transport:Transport.TCP,
            options:{
              host:cs.get('PAYMENT_HOST'),
              port:cs.get('PAYMENT_PORT')
            },
          }
        },
        inject:[ConfigService]
      },
    ]),
    
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService,ReservationRepository],
})
export class ReservationsModule {}


