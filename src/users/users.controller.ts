import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './models/users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ){}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async singup(@Body() singupDto: SignupDto):Promise<User> {
        return this.usersService.signup(singupDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto:LoginDto):Promise<{
        name: string, jwtToken: string, email: string
    }> {
        return this.usersService.login(loginDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @HttpCode(HttpStatus.CREATED)
    async findAll():Promise<User[]> {
        return this.usersService.findAll()
    }
}
