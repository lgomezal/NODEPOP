var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// Cargamos el conector a la base de datos
require('./lib/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cargamos nuestras rutas
app.use('/',      require('./routes/index'));
app.use('/users', require('./routes/users'));

// rutas del APIv1
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));

// error handler
app.use(function(err, req, res) {

    res.status(err.status || 500);

    if (isAPI(req)) {
        res.json({ success: false, error: err.message});
        return;
    }

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
  
    res.render('error');
});

function isAPI(req) {
    return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;
