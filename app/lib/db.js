var mongo = require('mongodb')
  ,host = process.env['DOTCLOUD_DB_MONGODB_HOST'] || 'localhost'
  ,port = process.env['DOTCLOUD_DB_MONGODB_PORT'] ||  27017
  ,user = process.env['DOTCLOUD_DB_MONGODB_LOGIN'] || undefined
  ,pass = process.env['DOTCLOUD_DB_MONGODB_PASSWORD'] || undefined
  ,mongoServer = new mongo.Server(host, parseInt(port, 10), {})
  ,db = new mongo.Db("skeleton", mongoServer, {safe: false, auto_reconnect:true})
  ;

db.open(function(err){
  if(err) { throw new Error(err); }

  if(user && pass) {
    db.authenticate(user, pass, function(err) {
      if(err) { throw new Error(err); }
    });
  }
});

module.exports = db;