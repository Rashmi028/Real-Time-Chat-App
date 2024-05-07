import mongoose from "mongoose";
import bcrypt from "bcryptjs";
//creating schema
const ChatSchema = new mongoose.Schema({
sender_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Register'
},

reciever_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Register'
},

message:{
    type:String,
    required:true 
}
},
{timestamp:true}
)
//creating collections

const Chat = new mongoose.model("Chat",ChatSchema);
export default Chat;
// module.exports=Register;