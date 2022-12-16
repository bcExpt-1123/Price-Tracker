import axios from "axios";
import * as cheerio from "cheerio";

export default function handler(req, res) {
  if (req.method === "POST") {
    axios
      .get(req.body.url)
      .then(function (response) {
        const html = response.data;
        const $ = cheerio.load(html);
        const price = $(".product-price").text();
        const title = $("#pdp_product_title").text();

        return res.status(200).json({ price, title });
      })
      .catch(function (error) {
        return res.json({ error });
      });
  } else {
    return res.json({ error: "unauthorized" });
  }
}
