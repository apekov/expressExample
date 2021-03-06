const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(
    session({
        secret: 'loftschool',
        key: 'sessionkey',
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 10 * 60 * 1000
        },
        saveUninitialized: false,
        resave: false
    })
)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500)
    res.render('error', { message: err.message, error: err })
})

const server = app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port ' + server.address().port)
})