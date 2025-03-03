import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/random";

app.use(express.static("public"));
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    res.render("index.ejs", {
      secret: response.data.secret,
      user: response.data.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching the secret.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
