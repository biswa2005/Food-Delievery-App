import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	registerFoodPartner,
	loginFoodPartner,
	logoutFoodPartner,
} from "../controllers/auth.controller.js";

const router = express.Router();

// User Auth API
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);

// Food Partner Auth API
router.post("/food-partner/register", registerFoodPartner);
router.post("/food-partner/login", loginFoodPartner);
router.get("/food-partner/logout", logoutFoodPartner);

export default router;
