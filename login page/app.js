import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "./src/db/conn.js";
import bcrypt from "bcryptjs";
import path from "path";
import Register from "./src/models/register.js";
import Chat from "./src/models/chatid.js";
import { json } from "express";
import session from "express-session";
import { Server} from "socket.io";
import { createServer } from "http";
import { islogin } from "./middleware/auth.js";
import { islogout} from "./middleware/auth.js";
// import io from "socket.io";
const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
app.use(express.static("public"));
app.use(express.json());
// app.use("/register",Register);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
let contactsArray = [];
app.set("view engine", "ejs");
app.get("/", islogout, (req, res) => {
    res.render("index.ejs");
  });
  app.get("/register.ejs",islogout, (req, res) => {
    res.render("register.ejs");
  });
  app.get("/group.ejs", (req, res) => {
    res.render("groups.ejs");
  });
  app.get("/forgot-password", (req, res) => {
    res.render("forgotpswd.ejs");
  });
  app.get("/contacts.ejs", (req, res) => {
    res.render("contacts",{ contactsArray });
  });

  // app.get("/home",islogin, async(req, res) => {
  //   try {
  //     // Retrieve user ID from session
  //     const userId = req.session.userId;

  //     // Find user by ID
  //     const loguser = await Register.findById(userId);

  //     res.render("homepage.ejs", { loguser }); // Pass the loguser object to the template
  // } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Error fetching user data");
  // }
  // });
  app.get("/profile.ejs", async (req, res) => {
    try {
      // Retrieve user ID from session
      const userId = req.session.userId;

      // Find user by ID
      const loguser = await Register.findById(userId);

      res.render("profile.ejs", { loguser }); // Pass the loguser object to the template
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching user data");
  }
  });

  app.get("/setting.ejs", async (req, res) => {
    try {
      // Retrieve user ID from session
      const userId = req.session.userId;

      // Find user by ID
      const loguser = await Register.findById(userId);

      res.render("setting.ejs", { loguser }); // Pass the loguser object to the template
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching user data");
  }
  });
  app.get("/logout.ejs", islogin,(req, res) => {
    res.render("index.ejs");
  });
  app.get("/mainchat.ejs", (req, res) => {
    res.render("mainchat.ejs", { contactsArray: contactsArray });
  });

  app.get("/chat.ejs",islogin,async (req, res) => {
    // res.render("chat.ejs", { contactsArray: contactsArray });
    try {
      // Retrieve user ID from session
      const userId = req.session.userId;

      // Find user by ID
      const loguser = await Register.findById(userId);

      res.render("chat.ejs", { loguser,contactsArray: contactsArray  }); // Pass the loguser object to the template
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching user data");
  }
  });
  app.post("/", async (req, res) => {
    try {
      const { email, Password } = req.body;
  
      // Find the user by email
      const user = await Register.findOne({ Email: email });
  
      // If the user doesn't exist, provide feedback
      if (!user) {
        return res.status(400).render("index.ejs", { message: "User not found" });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(Password, user.Password);
  
      // If the passwords don't match, provide feedback
      if (!isPasswordMatch) {
        return res.status(401).render("index.ejs", { message: "Incorrect password" });
      }
      req.session.userId = user._id;
      res.redirect("/chat.ejs");
      // If the passwords match, redirect to the home page or send a success message
   
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/register", async(req, res) => {
    try{
      const registerUser= new Register({
        Username:req.body.username,
        Email:req.body.email,
        Password:req.body.Password,
        Location:req.body.Location,

      });
      
  
      const registered=await registerUser.save();
      res.redirect("/");

     
    }
    catch(error){
      res.status(400).send(error);
    }
  });
 
 

  app.post("/forgotpswd", (req, res) => {
    console.log(req.body);
  });

  app.post("/contacts",async (req,res)=>{
    try {
      const inputName = req.body.inputname;
      const inputEmail = req.body.inputemail;

      // Check if the email exists in the database
      const existingUser = await Register.findOne({ Email: inputEmail });

      if (existingUser) {
          // If the email exists, add the contact to the array
          const newContact = { name: inputName, email: inputEmail,is_online: existingUser.is_online, _id: existingUser._id };
          contactsArray.push(newContact);
          console.log(newContact);
          res.render("contacts.ejs", { contactsArray });
      } else {
          // If the email does not exist, display an error message
          res.status(400).send("User with this email does not exist.");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
  })
  app.post("/deleteContact", (req, res) => {
    const contactNameToDelete = req.body.contactName;

    // Filter out the contact to be deleted
    const updatedContactsArray = contactsArray.filter(contact => contact.name !== contactNameToDelete);

    // Update the contactsArray
    contactsArray = updatedContactsArray;

    // Redirect back to the contacts page
    res.redirect("/contacts.ejs");
});

app.post('/save-chat',async(req,res)=>{
  try{
  var chat =new Chat({
    sender_id:req.body.sender_id,
    receiver_id:req.body.receiver_id,
    message:req.body.message,
  }) ;
  
  var newChat=await chat.save();
  res.status(200).send({success:true,msg:'Chat inserted!',data:newChat});
  }catch(error){
    res.status(400).send({success:false,msg:error.message});
  }
})
var usp=io.of('/user-namespace');
usp.on('connection',async function(socket){
     console.log('User Connected');
     var userId=socket.handshake.auth.token;

     await Register.findByIdAndUpdate({ _id: userId }, { $set:{ is_online:'1' }});

     //user broadcasst online status
     socket.broadcast.emit('getOnlineUser',{user_id:userId});
     socket.on('disconnect',async function(){
      console.log('User Disconnected');
      var userId=socket.handshake.auth.token;

      await Register.findByIdAndUpdate({ _id: userId }, { $set:{ is_online:'0' }});

        //user broadcasst offline status
     socket.broadcast.emit('getOfflineUser',{user_id:userId});
     });

     //chatting implementation
     socket.on('newChat',function(data){
      socket.broadcast.emit('loadNewChat',data);
     })
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
 
