import express from "express";
import {
	authFoodPartnerMiddleware,
	authUserMiddleware,
} from "../middlewars/auth.middleware.js";
import {
	createFood,
	getFoodItems,
	getsavedFood,
	likeFood,
	saveFood,
} from "../controllers/food.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
});

// [Protected] Only if Food partner is logged in
router.post("/", authFoodPartnerMiddleware, upload.single("video"), createFood);
router.get("/", authUserMiddleware, getFoodItems);
router.post("/like", authUserMiddleware, likeFood);
router.post("/save", authUserMiddleware, saveFood);
router.get("/save", authUserMiddleware, getsavedFood);

export default router;
