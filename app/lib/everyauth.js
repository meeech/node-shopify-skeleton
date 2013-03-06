require('../env');

var everyauth = require('everyauth');

//Need to set up the everyauth.shopify here, since it will be used when we plug
//everyauth into express so it has the proper routes (like /auth/shopify)
var apiKey = process.env.SHOPIFY_APIKEY
  ,secret = process.env.SHOPIFY_SECRET
  ;

everyauth.everymodule
  .findUserById( function (req, id, callback) {
    console.log('-> findUserById');
    callback(null, req.session.auth);
  }
);

everyauth
  .shopify
    .appId(apiKey)
    .appSecret(secret)
    .scope('write_products')
    .findOrCreateUser( function (sess, accessToken, accessSecret, shopifyUser) {
      console.log(shopifyUser);
      return shopifyUser;
    })
    .redirectPath("/finalize");

module.exports = everyauth;