// everyauth setup for app
// See everyauth docs for explanations how to configure things (if you don't want to use my setup)
require('../env');

var everyauth = require('everyauth')
  ,db = require('./db.js')
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

      //Add the accessToken to the user record, then we can act for the user
      // shop.accessToken = accessToken;

      db.collection('users', function(err, collection) {
        if(err) { throw new Error(err); }
/////
        // shop.arbitraty = 'fooooo';
        shop.accessToken = accessToken;
        shop._id = shop.id;
        collection.update({_id: shop.id}
          ,shop
          ,{ upsert: true });
        userPromise.fulfill(shop);
        console.log(shop);
  /////////////////////
      //   var result = collection.find({_id: shop.id});

      //   result.nextObject(function(err, doc) {
      //     if(err) { throw new Error(err); }

      //     if(doc === null) {
      //       collection.insert({_id: shop.id, shop: shop}, function(err,res) {
      //         if(err) { throw new Error(err); }
      //         userPromise.fulfill(res[0].shop);
      //       });
      //     }
      //     else{
      //       //In case we've changed the secret for the app
      //       if(doc.shop.accessToken !== accessToken) {
      //         doc.shop.accessToken = accessToken;
      //         collection.update({_id: shop.id}, {$set:{'shop.accessToken': accessToken}});
      //       }
      //       userPromise.fulfill(doc.shop);
      //     }
      //   });
      // });


      });
      return userPromise;
    })
    .redirectPath("/finalize");

module.exports = everyauth;
