var ShopifyAPI = require('node-shopify')
  , development = (process.env.NODE_ENV == 'development') ? true : false
  ;

//These should map to the plan types you offer.
var plans = {
  monthly: {
    recurring_application_charge: {
      name: "monthly"
      ,price: "10.00"
      ,test: development
    }}
  ,yearly: {
    application_charge: {
      name: "yearly"
      ,price: "100.00"
      ,test: development
    }}
};

// Handle requests for being billed
function charge(req, res) {
  if(req.user === undefined) { res.redirect('/'); return; }
  // console.log(req.user);
  var user = req.user
    , plan = plans[req.params.type]
    , type = Object.keys(plan)[0]
    ;

  plan[type].return_url = 'http://' + req.headers.host + '/charge/activate?type='+type;

  var client = new ShopifyAPI({
    debug: true
    ,version: "1.0.0"
    ,host: user.shop.myshopify_domain
    ,token: user.accessToken
  });

  client[type].create(plan, function(err, result) {
    res.redirect(result[type].confirmation_url);
  });
}

function activate(req, res) {
  var charge_id = req.query.charge_id
    , type = req.query.type
    , user = req.user
    ;

  var client = new ShopifyAPI({
    debug: true
    ,version: "1.0.0"
    ,host: user.shop.myshopify_domain
    ,token: user.accessToken
  });

  client[type].one({id: charge_id}, function(err, result) {
    var charge = result[type];

    if(charge.status == 'accepted') {

      var db = require('../lib/db/mongo.js');
      db.collection('users', function(err, collection) {
        if(err) { throw new Error(err); }

        collection.update({_id: user._id},
          {
            $set: {
              charge: {
                id: charge.id,
                type: type
              }
            }
          });
      });

      client[type].activate({id: charge_id}, function() {
        req.flash("success", "Thanks for your support!");
        res.redirect('/welcome');
      });
    }
    else {
      req.flash("info", "You declined. That's ok, I'll be here if you change your mind.");
      res.redirect('/welcome');
    }
  });
}

exports.charge = charge;
exports.activate = activate;