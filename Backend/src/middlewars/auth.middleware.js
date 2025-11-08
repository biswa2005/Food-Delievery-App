import jwt from "jsonwebtoken";
import foodPartnerModel from "../models/foodDelieveryPartner.model.js";
import User from "../models/user.model.js";

async function authFoodPartnerMiddleware(req, res, next) {
	const token = req.cookies.token;

	if (!token) {
		return res.status(400).json({
			message: "Please Login First",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const foodPartner = await foodPartnerModel.findById(decoded.id);

		if (!foodPartner) {
			return res.status(401).json({
				message: "Food partner not found",
			});
		}

		req.foodPartner = foodPartner;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid token or expired",
		});
	}
}

async function authUserMiddleware(req, res, next) {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			message: "Please Login First",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				message: "User not found",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid token or expired",
		});
	}
}

export { authFoodPartnerMiddleware, authUserMiddleware };
