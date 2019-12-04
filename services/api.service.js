"use strict";
const ApiGateway = require("moleculer-web");
const multiparty = require('multiparty');
const { upload } = require('../lib/multer');
const { checkCategoryExits } = require('../models/category')
const { TYPE } = require('../lib/my_error.js')


const { insertProduct, checkExist, updateProduct } = require('../models/product')

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**"
			],
			use: [
				(req, res, next) => next(new Error("Something went wrong")),
				function (err, req, res, next) {
					let token = req.headers.token;
					// if(!token) {
					// 	let send = {status: false,message: "token empty" , data: []};
					// 	res.end(JSON.stringify(send))
					// }
					next();
				},
			],
			aliases: {
				'GET category/list': 'category.list',
				'DELETE category/remove/:id': 'category.remove',
				'POST category/create': 'category.create',
				'PUT category/update': 'category.update',
				'GET product/list': 'product.list',
				'DELETE product/remove/:id': 'product.remove',
				"POST /product/create"(req, res) {
					this.createProduct(req, res)
				},
				"PUT /product/update"(req, res) {
					this.updateProduct(req, res)
				},
				"PUT /product/test": 'api.test',
			}
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		}
	},
	methods: {
		async createProduct(req, res){
			try {
				let data = await this.uploadFile(req, res);
				let { name, category_id, description, price } = data.body;
				if(data.file && data.file.path) {
					let path = data.file.path;
					let result = await this.insertDbProduct(name, category_id, description, price, path);
					let send = {status: true,message: "succes", data: result};
					res.end(JSON.stringify(send))
				} else{
					let send = {status: false,message: "Photos must not be empty" , data: []};
					res.end(JSON.stringify(send))
				}

			} catch (error) {
				console.log('error', error)
				let send = {status: false,message: error.message , data: []};
				res.end(JSON.stringify(send))
			}
		},
		async updateProduct(req, res){
			try {
				let data = await this.uploadFile(req, res);
				let { id, name, category_id, description, price } = data.body;
				if(data.file && data.file.path) {
					let path = data.file.path;
					console.log('path', path)
					let result = await this.updateDbProduct(id, name, category_id, description, price, path);
					let send = {status: true,message: "succes", data: result};
					res.end(JSON.stringify(send))
				}
				else{
					let send = {status: false,message: "Photos must not be empty" , data: []};
					res.end(JSON.stringify(send))
				}
			} catch (error) {
				let send = {status: false,message: error.message , data: []};
				res.end(JSON.stringify(send))
			}
		},
		uploadFile(req, res) {
			return new Promise((resolve , reject) => {
				let uploadSingle = upload.single('image');
				uploadSingle(req, res, function (err) {
					if(err) {
						reject(err)
					} else{
						resolve(req) //dg dan
					}
				})
			})
		},

		insertDbProduct(name, category_id, description, price, path){
			return new Promise( async (resolve, reject) => {
				try {
					let checkCategoryExist = await checkCategoryExits(category_id);
					if(!checkCategoryExist) {
						reject({
							type: TYPE,
							message: 'Category not exist'
						})
					}
					let result = await insertProduct(name, category_id, path, description, price );
					return resolve(result)
				} catch (error) {
					reject(error)
				}
			})
		},

		updateDbProduct(id,name, category_id, description, price, path){
			return new Promise( async (resolve, reject) => {
				try {
					let checkCategoryExist = await checkCategoryExits(category_id);
					if(!checkCategoryExist) {
						reject({
							type: TYPE,
							message: 'Category not exist'
						})
					}
					let checkProductExist = await checkExist(id);
					if(!checkProductExist) {
						return reject({
							type: TYPE,
							message: 'Product not exist'
						})
					}
					let result = await updateProduct(id, name, category_id, path, description, price );
					resolve(result)
				} catch (error) {
					reject(error)
				}
			})
		}
	},
};
