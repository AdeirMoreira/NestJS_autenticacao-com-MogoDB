import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from '../users/models/users.model'
import { jwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>
    ){}

    public async createAcessToken (userId:string) {
        return sign({userId}, process.env.JWT_KEY, {
            expiresIn: process.env.EXPIRES_IN
        })
    }

    public async validateUser (jwtPayload:jwtPayload) {
        const user = await this.userModel.findOne({_id: jwtPayload.userId})
        if(!user) {
            throw new UnauthorizedException({message: 'User not found'})
        }
        return user
    }

    public retunrjwtExtractor():(request:Request)=> string {
        return AuthService.jwtExtractor
    }

    private static jwtExtractor(request:Request):string {
        const authHeader = request.headers.authorization
        if(!authHeader) {
            throw new BadRequestException({message: 'Invalid Token'})
        }
        const [,token] = authHeader.split(' ')
        return token
    }
}
