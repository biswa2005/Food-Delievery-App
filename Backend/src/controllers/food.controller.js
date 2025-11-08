import foodModel from "../models/food.model.js";
import uploadFile from "../services/imagekit.service.js";
import { v4 as uuid } from "uuid";

async function createFood(req, res) {
	try {
		// Validate authentication
		if (!req.foodPartner) {
			return res.status(401).json({
				message: "Food partner authentication required",
			});
		}

		if (!req.file) {
			return res.status(400).json({
				message: "Video file is required",
			});
		}

		const fileUploadResult = await uploadFile(req.file.buffer, uuid());

		if (!fileUploadResult) {
			return res.status(500).json({
				message: "Failed to upload video",
			});
		}

		// ImageKit returns 'url' property
		const videoUrl = fileUploadResult.url;

		if (!videoUrl) {
			return res.status(500).json({
				message: "Failed to get video URL from upload result",
			});
		}
		const foodItem = await foodModel.create({
			name: req.body.name,
			description: req.body.description,
			video: videoUrl,
			foodPartner: req.foodPartner._id,
		});

		res.status(201).json({
			message: "food created successfully",
			food: foodItem,
		});
	} catch (error) {
		console.error("Error creating food:", error);
		res.status(500).json({
			message: "Failed to create food item",
			error: error.message,
		});
	}
}

async function getFoodItems(req, res) {
	const foodItems = await foodModel.find({});
	return res.status(200).json({
		message: "Food Items Fetched Successfully",
		foodItems,
	});
}

async function likeFood(req, res) {
	const { foodId } = req.body;
	const user = req.user;
}

async function saveFood(req, res) {}

async function getsavedFood(req, res) {}

export { createFood, getFoodItems, likeFood, saveFood, getsavedFood };
