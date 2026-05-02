import { apiGet, apiPost } from "./api";

const login = async (body) => {
  try {
    const response = await apiPost("/api/auth-service/login", body);
    return response;
  } catch (error) {
    throw error;
  }
};

const getUserInfo = async () => {
  try {
    const response = await apiGet("/api/auth-service/user-info");
    return response;
  } catch (error) {
    throw error;
  }
};

export { login, getUserInfo };
