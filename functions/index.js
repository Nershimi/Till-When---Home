const { onRequest } = require("firebase-functions/v2/https");
const { addNewProduct } = require("./saveProduct");
const { getExpiredProducts } = require("./getExpiredProducts");
const { getProductsAboutToExpire } = require("./getProductsAboutToExpire");
const { deleteProduct } = require("./deleteProduct");
const { saveUserPersonalDetails } = require("./saveUserPersonalDetails");
const logger = require("firebase-functions/logger");
const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase! check");
});

module.exports = {
  addNewProduct,
  helloWorld,
  getExpiredProducts,
  getProductsAboutToExpire,
  deleteProduct,
  saveUserPersonalDetails,
};
