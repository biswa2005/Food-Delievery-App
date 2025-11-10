import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		food: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "foods",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const saveModel = mongoose.model("saves", saveSchema);

export default saveModel;
