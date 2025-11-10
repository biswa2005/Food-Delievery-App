import foodModel from "../models/food.model.js";
import likeModel from "../models/likes.model.js";
import saveModel from "../models/saves.model.js";
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

	const isAlreadyLiked = await likeModel.findOne({
		user: user._id,
		food: foodId,
	});

	if (isAlreadyLiked) {
		await likeModel.deleteOne({
			user: user._id,
			food: foodId,
		});

		await foodModel.findByIdAndUpdate(foodId, {
			$inc: { likeCount: -1 },
		});

		return res.status(201).json({
			message: "Food disliked Successfully",
		});
	}

	const like = await likeModel.create({
		user: user._id,
		food: foodId,
	});
	await foodModel.findByIdAndUpdate(foodId, {
		$inc: { likeCount: 1 },
	});

	return res.status(201).json({
		message: "Food liked Successfully",
		like,
	});
}

async function saveFood(req, res) {
	const { foodId } = req.body;
	const user = req.user;

	const isAlreadySaved = await saveModel.findOne({
		user: user._id,
		food: foodId,
	});

	if (isAlreadySaved) {
		await saveModel.deleteOne({
			user: user._id,
			food: foodId,
		});

		await foodModel.findByIdAndUpdate(foodId, {
			$inc: { savesCount: -1 },
		});

		return res.status(201).json({
			message: "Food saved Successfully",
		});
	}

	const save = await saveModel.create({
		user: user._id,
		food: foodId,
	});
	await foodModel.findByIdAndUpdate(foodId, {
		$inc: { savesCount: 1 },
	});

	return res.status(201).json({
		message: "Food saved Successfully",
		save,
	});
}

async function getsavedFood(req, res) {
	const user = req.user;

	const savedFoods = await saveModel.find({ user: user._id }).populate("food");

	if (!savedFoods || savedFoods.length === 0) {
		return res.status(404).json({ message: "No saved Foods found" });
	}

	return res.status(200).json({
		message: "Saved Foods retrieved successfully",
		savedFoods,
	});
}

export { createFood, getFoodItems, likeFood, saveFood, getsavedFood };
