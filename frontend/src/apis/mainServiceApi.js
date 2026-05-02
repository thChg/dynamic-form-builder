import { apiDelete, apiGet, apiPost, apiPut } from "./api";

const createForm = async (formData) => {
  try {
    const response = await apiPost("/api/main-service/forms", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getForms = async () => {
  try {
    const response = await apiGet("/api/main-service/forms");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteForm = async (formId) => {
  try {
    const response = await apiDelete(`/api/main-service/forms/${formId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reorderForms = async (payload) => {
  try {
    const response = await apiPut("/api/main-service/forms/reorder", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createForm, getForms, deleteForm, reorderForms };
