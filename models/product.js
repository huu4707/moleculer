const db = require('../lib/db');

function insertProduct(name, category_id, image, description, price) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO product(category_id, name, image, description, price) VALUES(?,?,?,?, ?)";
        db.excuteQuery(sql, [category_id, name, image, description, price])
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err)
        })
    })   
}

function getInfo(id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM product WHERE id = ? ";
        db.findOneQuery(sql, [id])
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err)
        })
    })  
}

function checkExist(id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM product WHERE id = ? ";
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

function updateProduct(id, name, category_id, image, description, price) {
    return new Promise((resolve, reject) => {
        let sql = "UPDATE product SET category_id= ? , name= ?,image=?, description= ?, price=? WHERE id=?";
        db.excuteQuery(sql, [category_id, name, image, description, price, id])
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
        checkExist(id)
        .then(data => {
            db.excuteQuery("DELETE FROM product WHERE id = ?", [id])
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
}


function getList() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM product ORDER BY create_at DESC";
        db.findAllQuery(sql, [])
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err)
        })
    })   
}

module.exports = {
    insertProduct,
    getInfo,
    updateProduct,
    checkExist,
    remove,
    getList
}