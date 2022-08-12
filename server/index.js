const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const puppeteer = require("puppeteer");

require("events").EventEmitter.prototype._maxListeners = 0;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// GET request to api.genius.com
app.get("/api/search/:searchParam", (req, res) => {
  try {
    const search = req.query.search;
    axios
      .get(`https://api.genius.com/search?q=${search}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth_token,
        },
      })
      .then((response) => {
        const results = response.data;
        res.json(results);
        // res.send(results)
      });
  } catch (err) {
    return;
  }
});


app.get("/api/lyrics", async (req, res) => {
  var browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    var url = decodeURIComponent(req.query.search);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }); // 30 seconds heroku max
const pageContent = await page.evaluate(() => {
  const divs = Array.from(document.querySelectorAll('div.Lyrics__Container-sc-1ynbvzw-6'))
  return divs.map(d => d.innerText.trim())
});
    await page.close(); // close page after
    await browser.close();
    res.send(pageContent.toString())
  } catch (err) {
    console.log(err);
    return
  } finally {
    // console.log(url)
    return
  }
});

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});

app.get("/", (req, res) => {
  const sample = { value: "value" };
  res.json(sample);
});
