const formidable = require('formidable');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

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