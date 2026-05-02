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

const submitForm = async (formId, payload) => {
  try {
    const response = await apiPost(
      `/api/main-service/forms/${formId}/submit`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMySubmissions = async () => {
  try {
    const response = await apiGet("/api/main-service/forms/submissions");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateDraft = async (formId, formData) => {
  try {
    const response = await apiPut(`/api/main-service/forms/${formId}`, {
      ...formData,
      status: "DRAFT",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const publishForm = async (formId, formData) => {
  try {
    const response = await apiPut(`/api/main-service/forms/${formId}`, {
      ...formData,
      status: "PUBLISHED",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  createForm,
  getForms,
  deleteForm,
  reorderForms,
  submitForm,
  getMySubmissions,
  updateDraft,
  publishForm,
};
