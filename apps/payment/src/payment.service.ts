import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';


@Injectable()
export class PaymentService {

  private readonly stripe:Stripe;
  constructor(
    private readonly cs:ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notyService: ClientProxy
  ){
    this.stripe = new Stripe(this.cs.get<string>('STRIPE_SECRET_KEY') as string);
  }

  async createCharge({card,amount,email} : PaymentCreateChargeDto)
  {
    const paymentMethod  = await this.stripe.paymentMethods.create({
      type:'card',
      card: {token:'tok_visa'}
    });
    
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method:paymentMethod.id,
      amount: amount * 100,
      confirm:true,
      payment_method_types:['card'],
      currency:'usd',
    });
    this.notyService.emit('notify_email',{email,text: `Your payment of ${amount }$ completed`});
    return paymentIntent;
  }
}
