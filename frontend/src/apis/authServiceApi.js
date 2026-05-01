import { apiPost } from "./api";

const login = async (body) => {
  try {
    const response = await apiPost("/api/auth-service/login", body);
    return response;
  } catch (error) {
    throw error;
  }
};

export { login };
