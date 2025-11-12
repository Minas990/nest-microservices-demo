import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationsService {

  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService:ConfigService)
  {
    console.log(configService.get('SMPT_USER'));
      this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER'),
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      },
    });
  }
  
  async notifyEmail({email}:NotifyEmailDto)
  {
    await this.transporter.sendMail({
      from:this.configService.get('SMPT_USER'),
      to:email,
      subject:'Sleepr Nots',
      text:'TEST TEXT'
    })
  }
}
