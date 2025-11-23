import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/register`, {
      idempotencyKey: "test-" + Date.now(),
      ...formData,
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      ...formData,
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
