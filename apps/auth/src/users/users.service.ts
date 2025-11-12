import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService 
{
    constructor(private readonly userRepo:UsersRepository){}

    async create(createUserDto:CreateUserDto)
    {
        await this.validateCreateUserDto(createUserDto);
        return this.userRepo.create({
            ...createUserDto,
            password:await bcrypt.hash(createUserDto.password,10)
        });
    }
    
    async verifyUser(email:string,password:string)
    {
        const user = await this.userRepo.findOne({email});
        const passwordIsValid = await bcrypt.compare(password,user.password);
        if(!passwordIsValid) 
            throw new UnauthorizedException('creds are wrong');
        return user;
    }
    
    async getUser(getUserDto:GetUserDto)
    {
        return this.userRepo.findOne(getUserDto);
    }

    private async validateCreateUserDto(createUserDto:CreateUserDto)
    {
        try
        {
            await this.userRepo.findOne({email:createUserDto.email});
        }
        catch(err)
        {
            return ;//we want it to not exist;
        }
        throw new UnprocessableEntityException('email already exist');
    }
}
