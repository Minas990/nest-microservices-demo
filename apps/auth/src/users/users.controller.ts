import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser,UserDocument } from '@app/common';


@Controller('users')
export class UsersController 
{
    constructor(private readonly userService:UsersService){}
    @Post()
    async createUser(@Body() createUserDto : CreateUserDto)
    {
        return this.userService.create(createUserDto);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUer(@CurrentUser() user:UserDocument)
    {
        return user;
    }
}
