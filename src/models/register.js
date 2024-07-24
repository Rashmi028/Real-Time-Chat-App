import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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
    },
    is_online:{
        type:String,
        default:0,
        }
},
{timestamps:true}
)
UserSchema.pre("save", async function(next) {
if(this.isModified("Password")){
console.log(`the current password is ${this.Password}`);
this.Password = await bcrypt.hash(this.Password, 10);
console.log(`the current password is ${this.Password}`);
}
next();
})
//creating collections

const Register = new mongoose.model("Register",UserSchema);
export default Register;
// module.exports=Register;