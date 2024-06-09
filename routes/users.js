var express = require('express');
const Model_users = require('../model/model_users');
var router = express.Router();
/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Model_users.getId(id);
        if (Data.length > 0) {
            if(Data[0].level_users !== 'user'){
                res.redirect('logout');
            }else{
                res.render('users/users', {
                    title: 'Users Home',
                    nama_user: Data[0].nama_user,
                    email: Data[0].email,
                    level: Data[0].level_users
                });
            }
        } else {
            res.status(401).json({
                error: 'user tidak ada'
            });
        }
    } catch (error) {
        res.status(501).json('Butuh akses login');
    }
});

module.exports = router;