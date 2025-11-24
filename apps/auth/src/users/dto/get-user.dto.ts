import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetUserDto
{
    @IsNumber()
    @IsNotEmpty()
    id:number;
}