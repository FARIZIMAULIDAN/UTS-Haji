var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Model_users = require('../model/model_users');
const Model_pilihan = require('../model/model_pilihan');
const Model_pendaftaran = require('../model/model_pendaftaran');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/upload");
    },
    filename: (req, file, cb) =>{
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage});

router.get('/', async function(req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Model_users.getId(id);
        let rows = await Model_pendaftaran.getAll();
        if (Data.length > 0) {
            console.log("Data berhasil diambil:", rows);
            res.render('pendaftaran/index', {
                data: rows,
                level: Data[0].level_users
            });
        } else {
            console.log("Data tidak ditemukan, redirect ke halaman login");
            res.redirect('/login');
        }
    } catch (error) {
        console.log("Terjadi kesalahan:", error);
        res.redirect('/login');
    }
});

router.get('/create', async function (req, res, next) {
    try {
        let level_users = req.session.level;
        let id = req.session.userId;
        let Data = await Model_users.getId(id);
        console.log("Data pengguna:", Data); // Tambahkan console log di sini
        let rows = await Model_pilihan.getAll();
        console.log("Data pilihan:", rows); // Tambahkan console log di sini
        if (Data[0].level_users == 'user') {
            res.render('pendaftaran/create', {
                data: rows,
                level: level_users
            });
        } else if (Data[0].level_users == 'admin') {
            req.flash('failure', 'Anda bukan user');
            res.redirect('/pendaftaran');
        }
    } catch (error) {
        console.log("Terjadi kesalahan:", error); // Tambahkan console log di sini
        req.flash('invalid', 'Terjadi kesalahan saat memuat data');
        res.redirect('/login');
    }
});


router.post('/store', upload.single("foto"), function(req, res, next) {
    try {
        let { nama_jamaah, nik, alamat, id_pilihan, paspor } = req.body;
        
        // Melakukan validasi untuk memastikan paspor tidak null
        if (!paspor) {
            throw new Error("Paspor tidak boleh kosong");
        }

        let Data = {
            nama_jamaah,
            nik,
            alamat,
            id_pilihan,
            paspor,
            foto: req.file.filename
        };

        Model_pendaftaran.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/pendaftaran');
    } catch (error) {
        console.log("Terjadi kesalahan:", error);
        req.flash('error', 'Gagal menyimpan data: ' + error.message);
        res.redirect('/pendaftaran');
    }
});


router.get('/edit/(:id)', async function(req, res, next) {
    try {
        let id = req.params.id;
        let id_user = req.session.userId;
        let Data = await Model_users.getId(id_user);
        let rows_pilihan = await Model_pilihan.getAll();
        let rows = await Model_pendaftaran.getId(id);
        
        if (Data[0].level_users == 'user') {
            res.render('pendaftaran/edit', {
                data: rows[0],
                data_pilihan: rows_pilihan,
                level: Data[0].level_users
            });
        } else if (Data[0].level_users == 'admin') {
            req.flash('failure', 'Anda Bukan user');
            res.redirect('/pendaftaran'); // Perubahan di sini, menggunakan res.redirect
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat mengakses halaman edit:', error);
        req.flash('invalid', 'Terjadi kesalahan saat mengakses halaman edit');
        res.redirect('/login');
    }
});



router.post('/update/(:id)', upload.single("foto"), async function (req, res, next) {
    try {
        let id = req.params.id;
        let filebaru = req.file ? req.file.filename : null;
        let rows = await Model_pendaftaran.getId(id);
        const namaFileLama = rows[0].foto;

        if (filebaru && namaFileLama) {
            const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }

        let { nama_jamaah, nik, alamat, id_pilihan, paspor} = req.body;
        let foto = filebaru || namaFileLama
        let Data = {
            nama_jamaah: nama_jamaah,
            nik,
            alamat,
            id_pilihan,
            paspor,
            foto,
        }
        await Model_pendaftaran.Update(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/pendaftaran')
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.redirect('/pendaftaran');
    }
});

router.get('/delete/(:id)', async function (req, res) {
    try{
        let id = req.params.id;
        let id_users = req.session.userId;
        let Data = await Model_users.getId(id_users);
        let rows = await Model_pendaftaran.getId(id);
        if(Data[0].level_users == 'user'){
        const namaFileLama = rows[0].foto;
        if (namaFileLama) {
            const pathFilelama = path.join(__dirname, '../public/images/upload', namaFileLama);
            fs.unlinkSync(pathFilelama);
        }
        await Model_pendaftaran.Delete(id);
        req.flash('success', 'Berhasil menghapus data');
        res.redirect('/pendaftaran')
        
        }
        else if (Data[0].level_users == 'admin') {
            req.flash('failure', 'Anda bukan user');
            res.redirect('/pendaftaran')
        }
    } catch {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login')
    }
    })
module.exports = router;