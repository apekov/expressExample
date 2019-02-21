const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

module.exports.get = function(req, res) {
    res.render('pages/admin', { title: 'Main' })
}

module.exports.postProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    let upload = path.join('./public', 'upload')

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload)
    }
    form.uploadDir = path.join(process.cwd(), upload)
    form.parse(req, function(err, fields, files) {
        if (err) {
            return next(err)
        }
        const valid = validation(fields, files)

        if (valid.err) {
            fs.unlinkSync(files.photo.path)
            return res.end(`/?msg=${valid.status}`)
        }
        const fileName = path.join(upload, files.photo.name)

        fs.rename(files.photo.path, fileName, function(err) {
            if (err) {
                console.error(err.message)
                return
            }
            let dir = fileName.split('/');
            let filePath = `${dir[dir.length - 2] }/${dir[dir.length - 1]}`;

            db.get('products')
                .push({ name: fields.name, price: fields.price, imgPath: filePath })
                .write()
            res.redirect('/admin?Продукт был успешно добавлен')
        })
    })
}

module.exports.postSkills = (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields) => {
        for (key in fields) {
            if (fields[key] != '') {
                db.get('skills')
                    .find({ type: key })
                    .assign({ number: fields[key] })
                    .write()
            }
        }
    })
    res.redirect('/admin?Числа были успешно обновлены')
}

const validation = (fields, files) => {
    if (files.photo.name === '' || files.photo.size === 0) {
        return { status: 'Не загружена картинка!', err: true }
    }
    if (!fields.name) {
        return { status: 'Не указано название!', err: true }
    }
    if (!fields.price) {
        return { status: 'Не указана цена!', err: true }
    }
    return { status: 'Ok', err: false }
}