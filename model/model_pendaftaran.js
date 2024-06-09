const connection = require('../config/db');

class Model_pendaftaran {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT *, b.nama_pilihan FROM pendaftaran AS a JOIN pilihan AS b ON b.id_pilihan = a.id_pilihan ORDER BY a.id_pendaftaran DESC", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO pendaftaran SET ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT *, b.nama_pilihan FROM pendaftaran AS a JOIN pilihan AS b ON b.id_pilihan = a.id_pilihan WHERE a.id_pendaftaran = ?`, id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE pendaftaran SET ? WHERE id_pendaftaran =' + id, Data, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM pendaftaran WHERE id_pendaftaran =' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_pendaftaran;
