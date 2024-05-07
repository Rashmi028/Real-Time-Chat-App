import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "./src/db/conn.js";
import bcrypt from "bcryptjs";
import path from "path";
import Register from "./src/models/register.js";
import { json } from "express";
import session from "express-session";
import { Server} from "socket.io";
import { createServer } from "http";
import { islogin } from "./middleware/auth.js";
import { islogout} from "./middleware/auth.js";
// Set up session with a secret key and other options

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
var usp=io.of('/user-namespace');
usp.on('connection',function(socket){
     console.log('User Connected');

     socket.on('disconnect',function(){
      console.log('User Disconnected');
     });
});

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
  app.get("/home",islogin, (req, res) => {
    res.render("homepage.ejs");
  });
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


  app.get("/chat.ejs", (req, res) => {
    res.render("chat.ejs");
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
      res.redirect("/home");
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
          const newContact = { name: inputName, email: inputEmail };
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
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  