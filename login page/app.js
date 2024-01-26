import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "./src/db/conn.js";
import path from "path";
import Register from "./src/models/register.js";
import { json } from "express";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(express.json());
// app.use("/register",Register);
app.use(bodyParser.urlencoded({ extended: false }));
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

  app.get("/home", (req, res) => {
    res.render("homepage.ejs");
  });
  app.get("/profile.ejs", (req, res) => {
    res.render("profile.ejs");
  });
  app.post("/", (req, res) => {
    console.log(req.body);
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
      res.redirect("/index.ejs");
    }
    catch(error){
      res.status(400).send(error);
    }
  });
  app.post("/forgotpswd", (req, res) => {
    console.log(req.body);
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
