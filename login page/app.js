import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import "./src/db/conn.js";
// import socketio from "socket.io"
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
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
  app.post("/", (req, res) => {
    console.log(req.body);
  });
  app.post("/register", (req, res) => {
    console.log(req.body);
  });
  app.post("/forgotpswd", (req, res) => {
    console.log(req.body);
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
