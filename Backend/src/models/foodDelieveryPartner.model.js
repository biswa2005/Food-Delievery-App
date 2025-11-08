import mongoose from "mongoose";

const foodDelieveryPartnerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	contactName: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const foodPartnerModel = mongoose.model(
	"foodpartners",
	foodDelieveryPartnerSchema
);

export default foodPartnerModel;
