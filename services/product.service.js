const db = require('../lib/db');
const {reponseErrorAPI} = require('../lib/reponse.js')
const dbProduct = require('../models/product')

module.exports = {
	name: "product",
	settings: {
		routes: [
			{
			},

		],
	},

	dependencies: [],	

	actions: {
		async list() {
			try {
				let data =  await dbProduct.getList()
				return reponseErrorAPI(true,"Success", data)	
			} catch (error) {
				return reponseErrorAPI(false,error.message, [])
			}
			
		},

		remove:{
			async handler(ctx) {
				try {
					let data =  await dbProduct.remove(ctx.params.id)
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
			}
		},
		
		info: {
			async handler(ctx) {
				try {
					let data =  await getInfo(ctx.params.id);
					return reponseErrorAPI(true, "Success", data)

				} catch (error) {
					return reponseErrorAPI(false, error.message, [])
				}
			}
		}
	},
	events: {

	},

	methods: {
	},

};