//Set up some environment vars we expect to find on the server
//for local development
if((process.env.NODE_ENV || 'development') == "development") {
  process.env['PORT'] = "8080"

  //APP: API Testing
  process.env['SHOPIFY_APIKEY'] = "YOUR-APP-API-KEY";
  process.env['SHOPIFY_SECRET'] = "SHHHH-ITS-A-SECRET";
}
