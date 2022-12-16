import axios from "axios";
import * as cheerio from "cheerio";

export default function handler(req, res) {
  if (req.method === "POST") {
    axios
      .get(req.body.url)
      .then(function (response) {
        const html = response.data;
        const $ = cheerio.load(html);
        const price = $(
          ".product-price.css-11s12ax.is--current-price.css-tpaepq"
        ).text();
        const title = $("#pdp_product_title.headline-2.css-16cqcdq").text();

        if (price && title) {
          return res.status(200).json({ price, title });
        }
        return res.status(404).json({ error: "This url is not on the list" });
      })
      .catch(function (error) {
        console.log(error);
        return res.json({ error });
      });
  } else {
    return res.json({ error: "unauthorized" });
  }
}
