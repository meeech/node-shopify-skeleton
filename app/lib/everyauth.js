require('../env');

var everyauth = require('everyauth')
  ,db = require('./db.js')
  ;

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
      return shopifyUser;
    })
    .redirectPath("/finalize");

module.exports = everyauth;