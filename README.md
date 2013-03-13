#Node-Shopify-Skeleton

##What is this ?
My base project to start out with for any node/express/shopify API.

##What you get

Right now, not to much - it's in the building it phase.

* express3 + handlebars
* everyauth
* mongodb
* node-shopify api i'm trying. Just has Billing & Product atm
* bootstrap

##Notes / Things to customize
* app.js
  `app.get("/charge/:type(yearly|monthly)"...` You want to modify this to whatever types of plans you have/accept

* controllers/shopify.js

  finalize(): redirects to /welcome after final step of authentication. You can modify finalize to do whatever you need to do after successfully authenticating

  charge(): Handles what you charging for. You define your plans.

  activate(): handles activation (if is in 'accepted' state). Adds some info about the charge to the user in the db.
