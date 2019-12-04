// const db = require('../lib/db');
const {reponseErrorAPI} = require('../lib/reponse.js')
const { TYPE } = require('../lib/my_error.js')
let dbCategory = require('../models/category')

module.exports = {
	name: "category",

	settings: {
	},

	dependencies: [],	

	actions: {
		async list() {
			try {
				let data =  await dbCategory.getList()
				return reponseErrorAPI(true,"Success", data)	
			} catch (error) {
				return reponseErrorAPI(false,error.message, [])
			}
			
		},

		remove:{
			async handler(ctx) {
				try {
					let data =  await dbCategory.remove(ctx.params.id)
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
				return await this.removeCategoryById(ctx.params.id);
			}
		},
		create: {
			params: {
			  name: { type: "string" },
			  position: { type: "number", integer: true },
			},
			async handler(ctx) {
				try {
					let data = await dbCategory.insert(ctx.params.name, ctx.params.position);
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
			}
		},

		update: {
			params: {
				id: { type: "number", integer: true },
				name: { type: "string" },
				position: { type: "number", integer: true },
			  },
			  async handler(ctx) {
				try {
					let data = await dbCategory.update(ctx.params.id,ctx.params.name, ctx.params.position);
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}	
			  }
		}
	},
	events: {

	},

	methods: {
	},

};