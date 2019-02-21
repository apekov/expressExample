const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next()
    } else {
        res.redirect('/login?Пожалуйста авторизуйтесь')
    }
}
router.get('/', ctrlHome.get);
router.post('/', ctrlHome.post);

router.get('/login', ctrlLogin.get);
router.post('/login', ctrlLogin.post);

router.get('/admin', isAdmin, ctrlAdmin.get);
router.post('/admin/upload', ctrlAdmin.postProduct);
router.post('/admin/skills', ctrlAdmin.postSkills);

module.exports = router