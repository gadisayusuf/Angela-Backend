import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let data = 0;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs",{ header:"Write Your Name Here"})
});

app.post("/submit", (req, res) => {
  data = req.body.fName.length + req.body.lName.length;
  res.render("index.ejs", { header: `Your Name has ${data} number of letters!` });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
