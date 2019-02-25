const formidable = require('formidable');
const db = require('../models/db');

let products = db.get('products')
    .value();
let skills = db.get('skills')
    .value();

module.exports.get = function(req, res) {
    res.render('pages/index', { products: products, skills: skills })
}

module.exports.post = function(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let valid = validation(fields);
        if (!valid.err) {
            db.get('messages')
                .push({ name: fields.name, email: fields.email, message: fields.message })
                .write();
            res.redirect('/?msg=Сообщение успешно отправлено');
        } else {
            res.redirect('/?msg=Сообщение не отправлено!');
        }
    })
}

const validation = (fields) => {
    if (!fields.name) {
        return { status: 'Не указано имя!', err: true }
    }
    if (!fields.email) {
        return { status: 'Не указан email!', err: true }
    }
    return { status: 'Ok', err: false }
}