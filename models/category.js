const db = require('../lib/db');
const { TYPE } = require('../lib/my_error')
function checkCategoryExits(id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM category WHERE id = ?";
        db.findOneQuery(sql, [id])
        .then(data => {
            resolve(true);
        })
        .catch(err => {
            if(err.type == 'MY_ERROR') {
                resolve(false)
            } else{
                reject(err)
            }
        })
    })   
}

function getList() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM category ORDER BY position ASC";
        db.findAllQuery(sql, [])
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err)
        })
    })   
}

function remove(id) {
    return new Promise((resolve, reject) => {
        db.findOneQuery("SELECT * FROM category WHERE id =?", [id])
        .then(data => {
            db.excuteQuery("DELETE FROM category WHERE id = ?", [id])
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
}

function checkExistName(name, id='') {
    return new Promise((resolve, reject) => {
        let sql =`SELECT * FROM category WHERE name = '${name}'`;
        if(id!='') {
            sql+= ` AND id!=${id}`
        }
        db.findOneQuery(sql, [])
            .then(data => {
                resolve(true)
            })
            .catch(err => {
                console.log('err', err)
                if(err.type =="MY_ERROR") {
                    resolve(false)
                }else{
                    reject(err)
                }
            })
    })
}

function insert(name, position) {
    return new Promise((resolve, reject) => {
        checkExistName(name)
        .then(check => {
            if(!check){
                db.excuteQuery("INSERT INTO category(name,position) VALUES(?, ?)", [name, position])
                .then(data => {
                    resolve(data);
                })
                .catch(error => reject(error))
            } else{
                reject({
                    type: TYPE,
                    message: "Category exist"
                })
            }
        })
        .catch(error => reject(error))
    })                
}

function update(id, name, position) {
    return new Promise((resolve, reject) => {
        checkExistName(name,id)
        .then(check => {
            if(!check){
                db.excuteQuery("UPDATE category SET name =? , position = ? WHERE id = ? ", [name, position, id])
                .then(data => {
                    resolve(data);
                })
                .catch(error => reject(error))
            } else{
                reject({
                    type: TYPE,
                    message: "Category exist"
                })
            }
        })
        .catch(error => reject(error))
    }) 
}
module.exports = {
    remove,
    getList,
    checkCategoryExits,
    insert,
    update
}