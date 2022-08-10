const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const puppeteer = require("puppeteer");
const auth_token =
  "bvYasddC9W6qkPTUxcUA-DiTB99qCnO2E-VlSWppAGhE8XZzjTUgu4HyieBtbEAP";
require("events").EventEmitter.prototype._maxListeners = 0;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001

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
  try {
    const search = decodeURIComponent(req.query.search);
    const page = await configureBrowser(String(search));
    const pageContent = await checkDetails(page);
    // res.send(pageContent);
    return res.status(200).json(pageContent);
  } catch (err) {
    // console.log(err);
    return;
  }
});

async function configureBrowser(inputUrl) {
  try {
    const url = inputUrl;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 0 });
    browser.close();
    return page;
  } catch (err) {
    console.log(err);
  }
}

async function checkDetails(page) {
  const pageContent = await page.$eval(
    "div.Lyrics__Container-sc-1ynbvzw-6",
    (res) => {
      return res.innerText;
    }
  );
  return pageContent;
}

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});

app.get("/", (req, res) => {
  const sample = { value: "value" };
  res.json(sample);
});
