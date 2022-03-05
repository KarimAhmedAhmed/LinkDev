import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema=new mongoose.Schema({
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    mobile:{type:String,unique:true,required:true},
    address:{type:String,required:true},
    activationCode:{type:String,unique:true,required:true},
    name:{type:String,required:true},
    isActive:{type:Boolean,required:true,default:false},


})

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashed = await bcrypt.hash(this['password'], 10);
      this['password'] = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  });