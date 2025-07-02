import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const userschema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },

},{timestamps:true , minimize:false })

userschema.statics.hashpassword=async function(password){
    return await bcrypt.hash(password,10);
}

userschema.methods.generatetoken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    return token;
}
userschema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const usermodel=mongoose.model("user",userschema);
export default usermodel;