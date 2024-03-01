import { Schema, Model } from "mongoose";

//esquema
const productsSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	code: {
		type: Number,
		required: true,
		unique: true,
	},
	price: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
	},
	category: {
		type: String,
	},
});
