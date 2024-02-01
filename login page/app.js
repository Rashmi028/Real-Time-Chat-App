import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "./src/db/conn.js";
import bcrypt from "bcryptjs";
import path from "path";
import Register from "./src/models/register.js";
import { json } from "express";
// import io from "socket.io";
let loguser;
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(express.json());
// app.use("/register",Register);
app.use(bodyParser.urlencoded({ extended: false }));
let contactsArray = [];
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("index.ejs");
  });
  app.get("/register.ejs", (req, res) => {
    res.render("register.ejs");
  });
  app.get("/index.ejs", (req, res) => {
    res.render("index.ejs");
  });
  app.get("/forgot-password", (req, res) => {
    res.render("forgotpswd.ejs");
  });
  app.get("/contacts.ejs", (req, res) => {
    res.render("contacts",{ contactsArray });
  });

  app.get("/home", (req, res) => {
    res.render("homepage.ejs");
  });
 
  app.get("/profile.ejs", async (req, res) => {
    try {
      const loguser = await Register.findById(req.user.id); // Assuming you have the user's ID
      res.render("profile.ejs", { loguser }); // Pass the loguser object to the template
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching user data");
    }
  });
  app.get("/setting.ejs", (req, res) => {
    res.render("setting.ejs");
  });
  app.get("/logout.ejs", (req, res) => {
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
  
      // If the passwords match, redirect to the home page or send a success message
      res.redirect("/home");
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

      })
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
    const inputName = req.body.inputname;
    const inputEmail = req.body.inputemail;
    const newContact = { name: inputName, email: inputEmail };
    contactsArray.push(newContact);
    res.render("contacts.ejs", { contactsArray });
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
  
