var express = require("express");
var router = express.Router();
var axios = require("axios");
var databases = require("../databases");
var cache = require("memory-cache");

/* GET beers listing. */
router.get("/", function (req, res, next) {
  const search = req.query.search || '';
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 25;
  const cacheData = cache.get(search + page + perPage);
  if (cacheData) {
    return res.send(cacheData);
  }
  const punkApi = new URL("https://api.punkapi.com/v2/beers");
  const queryParams = {
    beer_name: search,
    page: page,
    per_page: perPage,
  };
  punkApi.search = new URLSearchParams(queryParams).toString();
  axios
    .get(punkApi.toString())
    .then((response) => {
      const beersData = response.data.map((item) => {
        const { id, name, description, first_brewed, food_pairing } = item;
        return { id, name, description, first_brewed, food_pairing };
      });
      cache.put(search + page + perPage, beersData);
      res.send(beersData);
    })
    .catch((error) => {
      const statusCode = error?.response?.status || 500;
      res
        .status(statusCode)
        .send(error?.response?.data || { statusCode: statusCode, error: "Internal Server Error", message: error.message });
    });
});

/* POST beers rating */
router.post("/rating/:beerId", function (req, res, next) {
  const beerId = req.params.beerId;
  const { rating, comments } = req.body;
  const userEmail = req.headers["x-user"];
  if (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "rating must be a number and greater than 0 or less than 6",
    });
  }
  const punkApi = "https://api.punkapi.com/v2/beers/" + beerId;
  axios
    .get(punkApi)
    .then((response) => {
      databases.beerRating.find().make(function (filter) {
        filter.where("beer_id", beerId);
        filter.where("rating", Number(rating));
        filter.where("user", userEmail);
        filter.where("comments", comments || "");
        filter.callback(function (err, response) {
          if (err) {
            return res.status(500).send({
              statusCode: statusCode,
              error: "Internal Server Error",
              message: err,
            });
          }
          if (response && response.length == 0) {
            databases.beerRating.insert({ user: userEmail, beer_id: beerId, rating: Number(rating), comments: comments || "" });
            res.send({
              message: "rating is added successfully.",
            });
          } else {
            res.send({
              message: "you have added rating to this beer already.",
            });
          }
        });
      });
    })
    .catch((error) => {
      const statusCode = error?.response?.status || 500;
      res
        .status(statusCode)
        .send(error?.response?.data || { statusCode: statusCode, error: "Internal Server Error", message: error.message });
    });
});
module.exports = router;
