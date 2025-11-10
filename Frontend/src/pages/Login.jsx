import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { authAPI } from "../services/api";
import useAuthStore from "../store/authStore";

const Login = () => {
	const navigate = useNavigate();
	const { login, setLoading, isLoading, checkAuth } = useAuthStore();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	// "user" or "foodPartner"
	const [loginType, setLoginType] = useState("user");
	const [error, setError] = useState("");

	useEffect(() => {
		const isAuth = checkAuth();
		if (isAuth) {
			navigate("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError("");
	};

	const handleLoginTypeChange = (e) => {
		setLoginType(e.target.value);
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			let response;
			if (loginType === "user") {
				response = await authAPI.loginUser({
					email: formData.email,
					password: formData.password,
				});
			} else if (loginType === "foodPartner") {
				response = await authAPI.loginFoodPartner({
					email: formData.email,
					password: formData.password,
				});
			}

			// The field varies between API responses
			const userData =
				loginType === "user" && response && response.user
					? response.user
					: loginType === "foodPartner" &&
					  response &&
					  (response.food_Partner || response.foodPartner);

			if (userData) {
				login(userData);
				navigate("/");
			} else {
				setError("Login failed. Please check your credentials.");
			}
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					"Login failed. Please check your credentials."
			);
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-500">
			<div className="max-w-md w-full">
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6 transition-colors duration-500">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							Welcome Back
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Sign in to continue
						</p>
					</div>

					{error && (
						<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Login As dropdown */}
						<div>
							<label
								htmlFor="loginType"
								className="block text-gray-700 dark:text-gray-300 mb-1 font-medium"
							>
								Login as
							</label>
							<select
								id="loginType"
								name="loginType"
								value={loginType}
								onChange={handleLoginTypeChange}
								className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
								style={{ transition: "all 0.2s" }}
							>
								<option value="user">User</option>
								<option value="foodPartner">Food Partner</option>
							</select>
						</div>

						<Input
							type="email"
							name="email"
							placeholder="Email Address"
							value={formData.email}
							onChange={handleChange}
							icon={Mail}
							required
						/>

						<Input
							type="password"
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={handleChange}
							icon={Lock}
							required
						/>

						<Button type="submit" isLoading={isLoading} className="w-full">
							Login
						</Button>
					</form>

					<div className="text-center text-sm text-gray-600 dark:text-gray-400">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
						>
							Register here
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
