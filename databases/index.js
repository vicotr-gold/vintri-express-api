var NoSQL = require("nosql");
var beerRating = NoSQL.load("./databases/beer_rating.nosql");
var logging = NoSQL.load("./databases/logging.nosql");

module.exports = {
  beerRating,
  logging,
};
