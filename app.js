const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const API_KEY = "862eed9f-5821-4d97-8d93-78a075f57739";
const FORTNITE_API_URL = "https://fortnite-api.com/v2/shop?language=en";

const groupShopDataByLayout = (entries) => {
  let groupedData = {};

  entries.forEach((entry) => {
    const layoutTitle = entry.layout?.name || "Unknown Layout";
    if (!groupedData[layoutTitle]) {
      groupedData[layoutTitle] = [];
    }
    groupedData[layoutTitle].push(entry);
  });

  return groupedData;
};

app.get("/", (req, res) => {
  res.render("home", { title: "Home", activePage: "home" }, (err, html) => {
    if (err) {
      return res.status(500).send("Error rendering home page");
    }

    res.render("layout", { title: "Home", activePage: "home", body: html });
  });
});

app.get("/shop", async (req, res) => {
  try {
    const response = await axios.get(FORTNITE_API_URL, {
      headers: { Authorization: API_KEY },
    });

    const shopData = response.data.data.entries;
    const groupedShopData = groupShopDataByLayout(shopData);

    res.render(
      "shop",
      { title: "Fortnite Shop", activePage: "shop", groupedShopData },
      (err, html) => {
        if (err) {
          return res.status(500).send("Error rendering shop page");
        }

        res.render("layout", { title: "Fortnite Shop", activePage: "shop", body: html });
      }
    );
  } catch (error) {
    console.error("Error fetching shop data:", error.message);
    res.status(500).send("Failed to fetch shop data");
  }
});

app.get("/battle-pass", (req, res) => {
  res.render("layout", { title: "Battle Pass", activePage: "battle-pass", body: "Battle Pass Content" });
});

app.get("/news", (req, res) => {
  res.render("layout", { title: "News", activePage: "news", body: "News Content" });
});

app.get("/vbucks", (req, res) => {
  res.render("layout", { title: "V-Bucks", activePage: "vbucks", body: "V-Bucks Content" });
});

app.get("/purchases", (req, res) => {
  res.render("layout", { title: "Purchases", activePage: "purchases", body: "My Purchases Content" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
