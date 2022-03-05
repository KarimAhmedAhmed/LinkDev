import { Document } from 'mongoose';

export interface User extends Document {

   email: string;
   password: string;
   mobile: string;
   address: string;
   name: string;
   activationCode: string;
}