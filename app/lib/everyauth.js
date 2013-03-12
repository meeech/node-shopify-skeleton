// everyauth setup for app
// See everyauth docs for explanations how to configure things (if you don't want to use my setup)
require('../env');

var everyauth = require('everyauth')
  ,db = require('./db/mongo.js')
  ;

var apiKey = process.env.SHOPIFY_APIKEY
  ,secret = process.env.SHOPIFY_SECRET
  ;

everyauth.everymodule
  .findUserById( function (id, callback) {
    db.collection('users', function(err, collection) {
      if(err) { throw new Error(err); }

      var result = collection.find({_id: id});
      result.nextObject(function(err, doc) {
        callback(err, doc);
      });
    });
  });

everyauth
  .shopify
    .appId(apiKey)
    .appSecret(secret)
    .scope('write_products')
    .findOrCreateUser( function (sess, accessToken, accessSecret, shop) {

      var userPromise = this.Promise();

      db.collection('users', function(err, collection) {
        if(err) { throw new Error(err); }

        collection.update({_id: shop.id}
          ,{
            $set: {
              accessToken: accessToken
              ,shop: shop
            }
          }
          ,{ upsert: true });
        userPromise.fulfill(shop);
      });

      return userPromise;

    })
    .redirectPath("/finalize");

module.exports = everyauth;
