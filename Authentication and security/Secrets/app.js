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

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/test"),
      console.log("Connected to MongoDB");
  } catch {
    console.log("mongodb.connect error occurred:", err.message);
  }
};

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
connectDB();
const User = new mongoose.model("User", userSchema);
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    email: req.body.username,
    password: hashed,
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
    const user = await User.findOne({ email: username });
    if (!user) {
      res
        .status(401)
        .render("login", { message: "Invalid username or password" });
      console.log("invalid username or password");
      return;
    }
    const result = await bcrypt.compare(password, user.password);
    console.log(result);
    if (result) {
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
