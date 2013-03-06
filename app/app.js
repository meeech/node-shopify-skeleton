require('./env');

/* Express quick setup */
var express = require('express')
  ,app = express()
  ,everyauth = require('./lib/everyauth')
  ,exphbs  = require('express3-handlebars')
  ,server = require('http').createServer(app)
  ,port = process.env.PORT || 8080
  ;

app.use(express.static(__dirname+'/public'));
app.use(express.bodyParser());
app.use(express.cookieParser('thisisasecretwheeeeee'));
app.use(express.session());
app.use(everyauth.middleware(app));

/* Handlebars setup */
var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      stringify: function (data) { return JSON.stringify(data); }
  },
  layoutsDir: __dirname+'/views/layouts'
  ,defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

app.get("/", function(req, res){
  res.render('home');
});

app.get("/welcome", function(req, res){
  if(req.user === undefined) { res.redirect('/'); return; }
  res.render('welcome', {user: req.user.user});
});

app.post("/login/authenticate", require('./controllers/shopify').authenticate);
app.get("/finalize", require('./controllers/shopify').finalize);

console.log('-> Listening on', port);
server.listen(port);
