const connection = require('../config/db');

class Model_pilihan{

    static async getAll() {
        return new Promise((resolve,reject) => {
            connection.query(`select *from pilihan order by id_pilihan desc`, (err,rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    }
    static async Store(Data) {
        return new Promise((resolve,reject) => {
            connection.query('insert into pilihan set ?',Data,function (err,result){
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }
    static async getId(id) {
        return new Promise((resolve,reject) => {
            connection.query('select *from pilihan where id_pilihan = ?' ,id, (err,rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    }
    static async Update(id, Data) {
        return new Promise((resolve,reject) => {
            connection.query('update pilihan set ? where id_pilihan ='+id,Data,function (err,result){
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }
    static async Delete(id) {
        return new Promise((resolve,reject) => {
            connection.query('delete from pilihan where id_pilihan ='+id,function (err,result){
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }


}



module.exports = Model_pilihan;