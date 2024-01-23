import express from "express"
import bodyparser from "body-parser"
import mongoose from "mongoose"
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
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
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
