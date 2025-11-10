import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Important for cookies
	headers: {
		"Content-Type": "application/json",
	},
});

// Auth API
export const authAPI = {
	registerUser: async (userData) => {
		const response = await api.post("/auth/user/register", userData);
		return response.data;
	},

	loginUser: async (credentials) => {
		const response = await api.post("/auth/user/login", credentials);
		return response.data;
	},

	logoutUser: async () => {
		const response = await api.get("/auth/user/logout");
		return response.data;
	},

	registerFoodPartner: async (partnerData) => {
		const response = await api.post("/auth/food-partner/register", partnerData);
		return response.data;
	},

	loginFoodPartner: async (credentials) => {
		const response = await api.post("/auth/food-partner/login", credentials);
		return response.data;
	},

	logoutFoodPartner: async () => {
		const response = await api.get("/auth/food-partner/logout");
		return response.data;
	},
};

export default api;
