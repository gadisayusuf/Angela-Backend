//jshint esversion:6
import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/test");
const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  try {
    const user = await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/register");
  }
});
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: username});
    if (user.password===password) {
      res.render("secrets");
    } else {
      res
        .status(401)
        .render("login", { message: "Invalid username or password" });
        console.log("invalid username or password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(3000, () => console.log("Server Running on port 3000"));
