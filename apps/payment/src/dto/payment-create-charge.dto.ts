import { CreateChargeDto } from "@app/common";
import { IsEmail, IsString } from "class-validator";

export class PaymentCreateChargeDto extends CreateChargeDto
{
    @IsEmail()
    email:string;
}