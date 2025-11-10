import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import foodPartnerModel from "../models/foodDelieveryPartner.model.js";
dotenv.config();

async function registerUser(req, res) {
	const { fullName, email, password } = req.body;
	if (!fullName || !email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({ message: "User already exists" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({
		fullName,
		email,
		password: hashedPassword,
	});

	const token = jwt.sign(
		{
			id: newUser._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "Production",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.status(201).json({
		message: "User created successfully",
		user: {
			id: newUser._id,
			fullName: newUser.fullName,
			email: newUser.email,
		},
	});
}

async function loginUser(req, res) {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	const token = jwt.sign(
		{
			id: user._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "Production",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	res.status(200).json({
		message: "Login successful",
		user: { id: user._id, fullName: user.fullName, email: user.email },
	});
}

function logoutUser(req, res) {
	res.clearCookie("token");
	res.status(200).json({ message: "User logged out successfully" });
}

async function registerFoodPartner(req, res) {
	const { name, contactName, phone, address, email, password } = req.body;
	if (!name || !contactName || !phone || !address || !email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const foodPartner = await foodPartnerModel.findOne({
		email,
	});
	if (foodPartner) {
		return res.status(400).json({
			message: "Food Partner Account Already Exists",
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newFoodPartner = await foodPartnerModel.create({
		name,
		contactName,
		phone,
		address,
		email,
		password: hashedPassword,
	});

	const token = jwt.sign(
		{
			id: newFoodPartner._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "Production",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.status(201).json({
		message: "Food Partner Account created successfully",
		food_Partner: {
			_id: newFoodPartner._id,
			name: newFoodPartner.name,
			phone: newFoodPartner.phone,
			email: newFoodPartner.email,
		},
	});
}

async function loginFoodPartner(req, res) {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const foodPartner = await foodPartnerModel.findOne({ email });
	if (!foodPartner) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
	if (!isPasswordValid) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	const token = jwt.sign(
		{
			id: foodPartner._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "Production",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	res.status(200).json({
		message: "Food Partner logged in successfully",
		food_Partner: {
			_id: foodPartner._id,
			name: foodPartner.name,
			email: foodPartner.email,
		},
	});
}

function logoutFoodPartner(req, res) {
	res.clearCookie("token");
	res.status(200).json({ message: "Food Partner logged out successfully" });
}

export {
	registerUser,
	loginUser,
	logoutUser,
	registerFoodPartner,
	loginFoodPartner,
	logoutFoodPartner,
};
