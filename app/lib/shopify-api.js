var request = require('request')
  , auth_token
  , domain
  , client
  ;

request.debug = true;

var init = function(token, shop_domain) {
  console.log('->Init token:'+token);
  console.log('->Init Shop:'+shop_domain);
  auth_token = token;
  domain = 'https://'+shop_domain;
  
  client = request.defaults({
    json: true
    ,headers: {'X-Shopify-Access-Token': token}
  });
  
  
};

var product_count = function(callback) {
  client.get( domain+'/admin/products/count.json', function(err, res, body) {
    callback(body);
  });
};

var products = function(page, callback) {
  console.log(page);
  client.get( {
    url:domain+'/admin/products.json'
    ,qs: { limit: 250, page: page, published_status: 'unpublished', fields: 'title,product_type,variants' }
  }, callback);
};

exports.init = init;
exports.product_count = product_count;
exports.products = products;