var everyauth = require('everyauth')
  ,Lang = require('yui').use().Lang
  ,development = (process.env.NODE_ENV == 'development') ? true : false
  ;

everyauth.debug = development;

function authenticate(req, res) {
  var shop = req.body.shop
    ,endpoint
    ;

  if(undefined === shop || Lang.trim(shop) === '') {
    console.log('No Shop, redirect to login');
    res.redirect('/');
  }

  shop = Lang.trim(shop.replace('http://', '').replace('https://',''));
  endpoint = Lang.sub('https://{shop}', {shop: shop});

  console.log('-> Authenticating Shop: ',shop);
  everyauth
    .shopify
      .apiHost(endpoint)
      .oauthHost(endpoint)
  ;

  res.redirect('/auth/shopify');
}

function finalize(req, res) {
  //Do any checks, etc...
  console.log('-> Finalize');
  var destination = "/welcome";
  if(req.session.return_to) {
    destination = req.session.return_to;
    req.session.return_to = null;
  }
  res.redirect(destination);
}

exports.authenticate = authenticate;
exports.finalize = finalize;
