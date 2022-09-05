import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './models/users.model';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        private readonly authService: AuthService
    ){}

    async signup (signupDto:SignupDto):Promise<User>{
        const user = new this.userModel(signupDto)
        return user.save()
    }

    async login (loginDto:LoginDto):Promise<{
        name: string, jwtToken: string, email: string
    }>{
        const user =  await this.findByEmail(loginDto.email)
        if(!user) {
            throw new NotFoundException({message: 'Email not found'})
        }
        const match = await this.checkPassword(loginDto.password,user)
        if(!match){
            throw new UnauthorizedException({message:'Wrong password'})
        } 
        const jwtToken = await this.authService.createAcessToken(user._id)

        return { name: user.name, jwtToken, email: user.email }
    }

    async findAll ():Promise<User[]> {
        return this.userModel.find()
    }

    private async findByEmail (email: string):Promise<User> {
        return this.userModel.findOne({email})
    }

    private async checkPassword (pawssword:string, user: User): Promise<boolean> {
        return bcrypt.compare(pawssword, user.password)
    }
}
