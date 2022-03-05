import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { RegisterDTO } from './register.dto';
import { ActivationDTO } from './activation.dto';

import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/types/payload';
const generator = require('generate-password');

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<User>,
      ) {}
    
      async create(RegisterDTO: RegisterDTO) {
        const { email,mobile,name,address } = RegisterDTO;
        const user = await this.userModel.findOne({ email });
        if (user) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
        const activationCode = generator.generate({
          length: 4,
          numbers: true,
          exclude: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
    
        });
        let userP = {
          email: email,
          mobile: mobile,
          name: name,
          address: address,
          activationCode: activationCode,

        }
        const createdUser = new this.userModel(userP);

       
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }


      async update(ActivationDTO: ActivationDTO) {
        const { password, activationCode} = ActivationDTO;
        const user = await this.userModel.findOne({ activationCode });
        if (!user) {
          throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
        }
              
        let userP = {
          password:password,
          activationCode: activationCode,

        }

        const hashed = await bcrypt.hash(password, 10);
        await user.update({ password: hashed, isActive: true });

        return this.sanitizeUser(user);
      }













      async findByPayload(payload: Payload) {
        const { email } = payload;
        return await this.userModel.findOne({ email });
      }
      
      async findByLogin(UserDTO: LoginDTO) {
        const { email, password } = UserDTO;
        const user = await this.userModel.findOne({ email });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
          return this.sanitizeUser(user)
        } else {
          throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
      }
      sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
      }

}
