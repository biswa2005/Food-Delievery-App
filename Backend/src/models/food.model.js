import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	video: {
		type: String,
		required: true,
	},
	foodPartner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "foodpartners",
	},
	likeCount: {
		type: number,
		default: 0,
	},
	savesCount: {
		type: number,
		default: 0,
	},
});

const foodModel = mongoose.model("foods", foodSchema);

export default foodModel;
