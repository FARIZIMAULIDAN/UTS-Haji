var express = require('express');
var router = express.Router();

const Model_pilihan = require('../model/model_pilihan');
const Model_users = require('../model/model_users');

// router.get('/create', async function (req, res, next) {
//     try{
//         let level_users = req.session.level;
//         let id = req.session.userId;
//         let Data = await Model_Users.getId(id);
//         let rows = await Model_Kategori.getAll();
//         if(Data[0].level_users == "2") {
//             res.render('barang/create', {
//                 data: rows,
//                 level: level_users
//             })
//         }
//         else if (Data[0].level_users == "1"){
//             req.flash('failure', 'Anda bukan admin');
//             res.redirect('/barang')
//         }
//     } catch {
//         req.flash('invalid', 'Anda harus login');
//         res.redirect('/login')
//     }
//     })

router.get('/', async function(req, res, next) {
    try {
        let level_users = req.session.Level;
        let id = req.session.userId;
        let Data = await Model_users.getId(id);
        let rows = await Model_pilihan.getAll();
        if (Data[0].level_users == 'admin') {
            res.render('pilihan/index', {
                data: rows,
                level: Data[0].level_users
            });
        } else if (Data[0].level_users == 'user') {
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/users');
        }
    } catch (error) {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login');
    }
});


router.get('/create', async function(req, res, next){
    try{
        let id = req.session.userId;
        let Data = await Model_users.getId(id);
        if(Data[0].level_users == 'admin'){
            res.render('pilihan/create',{
                nama_pilihan:'',
                level:Data[0].level_users
            })
        }else if(Data[0].level_users == 'user'){
            req.flash('failure','anda bukan admin');
            res.redirect('/index');
        }
    }catch{
        req.flash('invalid','anda harus login');
        res.redirect('/login');
    }
});

router.post('/store',async function(req,res,next){
    try{
        let {nama_pilihan} = req.body;
        let Data ={
            nama_pilihan,
        }
        await Model_pilihan.Store(Data);
        req.flash('success','Berhasil menyimpan data yeay');
        res.redirect('/pilihan')
    }catch{
        req.flash('error','gagal menyimpan data');
        res.redirect('/pilihan')
    }
})

router.get('/edit/(:id)',async function(req,res,next){
    try{
        let id_users = req.session.userId;
        let id = req.params.id;
        let rows = await Model_pilihan.getId(id);
        let Data = await Model_users.getId(id_users);
        if(Data[0].level_users == 'admin'){
            res.render('pilihan/edit',{
                id: rows[0].id_pilihan,
                nama_pilihan: rows[0].nama_pilihan,
                level:Data[0].level_users
            })
        }else if(Data[0].level_users == 'user'){
            req.flash('failure','anda bukan admin');
            res.redirect('/pilihan');
        }
    }catch{
        res.flash('error', 'gagal menyimpan data');
        res.redirect('/pilihan');
    }
})


router.post('/update/(:id)',async function(req,res,next){
    try{
        let id = req.params.id;
        let {nama_pilihan} = req.body;
        let Data = {
            nama_pilihan,
        }
        await Model_pilihan.Update(id,Data);
        req.flash('success','Berhasil update data');
        res.redirect('/pilihan')
    }catch{
        req.flash('error','gagal menyimapan data');
        res.redirect('/pilihan')
    }
})


router.get('/delete/(:id)', async function (req, res) {
    try{
        let id = req.params.id;
        let id_users = req.session.userId;
        let Data = await Model_users.getId(id_users);
        if(Data[0].level_users == 'admin'){
            await Model_pilihan.Delete(id);
            req.flash('success', 'Berhasil menghapus data');
            res.redirect('/pilihan' );
        }
        else if (Data[0].level_users == 'user') {
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/pilihan')
        }
    }catch{
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login')
    }
    })

module.exports = router;
