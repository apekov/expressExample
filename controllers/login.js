const formidable = require('formidable');
const db = require('../models/db');

let user = db.get('user')
    .value();

module.exports.get = function(req, res) {
    res.render('pages/login')
}

module.exports.post = function(req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields) => {
        if (fields.mail == user.mail || fields.password == user.password) {
            req.session.isAdmin = true;
            res.redirect('/admin');
        } else {
            res.redirect('/login?Неправильный логин пароль');
        }
    })
}