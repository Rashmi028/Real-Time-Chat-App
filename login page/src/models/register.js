import mongoose from "mongoose";
//creating schema
const UserSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true,
    },
    Password:{
        type:String,
        required:true,
    },
    Location:{
        type:String,
        required:true,
    }
})

//creating collections

const Register = new mongoose.model("Register",UserSchema);

module.exports=Register;