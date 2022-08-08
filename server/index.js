const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const puppeteer = require("puppeteer");
const auth_token =
  "bvYasddC9W6qkPTUxcUA-DiTB99qCnO2E-VlSWppAGhE8XZzjTUgu4HyieBtbEAP";

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    console.log(err);
  }
});

app.get("/api/lyrics/:lyricsParam", async (req, res) => {
  try {
    var search = decodeURIComponent(req.query.search);
    var page = await configureBrowser(search);
    var pageContent = await checkDetails(page);
    res.send(pageContent);
  } catch (err) {
    console.log(err);
  }
});

async function configureBrowser(inputUrl) {
  var url = inputUrl;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 0 });
  return page;
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

app.listen(3001, () => {
  console.log("server is running on port 3001");
});
