import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../apis/api.js";
import styles from "./FormDetailScreen.module.css";
import {
  createForm,
  submitForm,
  updateDraft,
  publishForm,
} from "../apis/mainServiceApi.js";
import Error from "../components/Error.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserInfo } from "../apis/authServiceApi.js";
import { fieldConfigurations } from "../constants/fieldConfiguration.jsx";
import FormDetailAdminContent from "../components/FormDetailAdminContent.jsx";
import FormDetailEmployeeContent from "../components/FormDetailEmployeeContent.jsx";

function FormDetailScreen() {
  const navigate = useNavigate();
  const { user: savedUser, setUser: setSavedUser } = useAuth();
  const { id } = useParams();
  const isNew = id === "new";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [currentUser, setCurrentUser] = useState(savedUser);
  const [newFieldType, setNewFieldType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(!savedUser);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadUser = async () => {
      if (savedUser) {
        setCurrentUser(savedUser);
        setIsUserLoading(false);
        return;
      }

      setIsUserLoading(true);

      try {
        const response = await getUserInfo();
        if (!isActive) return;
        setCurrentUser(response.data);
        setSavedUser(response.data);
      } catch (error) {
        if (!isActive) return;
        const message = error?.response?.data?.message;
        const statusCode = error?.response?.status;
        setError(message, statusCode);
      } finally {
        if (isActive) {
          setIsUserLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isActive = false;
    };
  }, [savedUser, setSavedUser]);

  const handleFieldDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setFormData((prev) => {
      const activeIndex = prev.fields.findIndex(
        (item) => item.id === active.id,
      );
      const overIndex = prev.fields.findIndex((item) => item.id === over.id);

      if (activeIndex === -1 || overIndex === -1) return prev;

      const nextFields = [...prev.fields];
      const [moved] = nextFields.splice(activeIndex, 1);
      nextFields.splice(overIndex, 0, moved);
      return { ...prev, fields: nextFields };
    });
  };

  const handleFieldLabelChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((item) =>
        item.id === fieldId ? { ...item, label: value } : item,
      ),
    }));
  };

  const handleFieldRemove = (fieldId) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((item) => item.id !== fieldId),
    }));
  };

  const handleFieldConditionsChange = (updatedField) => {
    const fieldConfig = fieldConfigurations[updatedField.type] || {};
    const nextConditions = Object.entries(updatedField.conditions || {}).reduce(
      (accumulator, [key, value]) => {
        if (key === "required") {
          accumulator[key] = value;
          return accumulator;
        }

        if (fieldConfig[key] === "date" && value) {
          accumulator[key] = value instanceof Date ? value : new Date(value);
          return accumulator;
        }

        accumulator[key] = value;
        return accumulator;
      },
      {},
    );

    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((item) =>
        item.id === updatedField.id
          ? { ...item, conditions: nextConditions }
          : item,
      ),
    }));
  };

  const serializeFormData = () => {
    return {
      title: formData.title,
      description: formData.description,
      fields: formData.fields.map((field) => ({
        ...field,
        conditions: field.conditions
          ? Object.entries(field.conditions).reduce((acc, [key, value]) => {
              acc[key] = value instanceof Date ? value.toISOString() : value;
              return acc;
            }, {})
          : null,
      })),
    };
  };

  const handleCreateDraft = async () => {
    try {
      const payload = serializeFormData();
      if (isNew) {
        await createForm({
          ...payload,
          status: "DRAFT",
        });
      } else {
        await updateDraft(id, payload);
      }
      navigate("/forms");
    } catch (error) {
      const message = error?.response?.data?.message;
      const statusCode = error?.response?.status;
      setError(message, statusCode);
    }
  };

  const handleCreateForm = async () => {
    try {
      const payload = serializeFormData();
      if (isNew) {
        await createForm({
          ...payload,
          status: "PUBLISHED",
        });
      } else {
        await publishForm(id, payload);
      }
      navigate("/forms");
    } catch (error) {
      const message = error?.response?.data?.message;
      const statusCode = error?.response?.status;
      setError(message, statusCode);
    }
  };

  const handleSubmitForm = async (responses) => {
    try {
      await submitForm(id, responses);
      navigate("/forms");
    } catch (error) {
      const message = error?.response?.data?.message;
      const statusCode = error?.response?.status;
      setError(message, statusCode);
    }
  };

  useEffect(() => {
    if (!id || isNew) return;
    let isActive = true;

    const loadForm = async () => {
      setIsLoading(true);
      try {
        const response = await apiGet(`/api/main-service/forms/${id}`);
        const payload = response.data?.data ?? response.data;
        if (!isActive) return;
        setFormData({
          title: payload?.title ?? "",
          description: payload?.description ?? "",
          status: payload?.status ?? "DRAFT",
          fields: payload?.fields ?? [],
        });
      } catch (error) {
        if (!isActive) return;
        const message = error?.response?.data?.message;
        const statusCode = error?.response?.status;
        setError(message, statusCode);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadForm();
    return () => {
      isActive = false;
    };
  }, [id, isNew]);

  if (isLoading || isUserLoading) {
    return <div className={styles.screen}>Loading...</div>;
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Form details</p>
          {isNew ? (
            <input
              className={styles.titleInput}
              type="text"
              placeholder="Form title"
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
            />
          ) : (
            <h1>{formData.title}</h1>
          )}
        </div>
      </header>
      <Error message={error} statusCode={errorCode} />
      {currentUser?.role === "ADMIN" ? (
        <FormDetailAdminContent
          formData={formData}
          setFormData={setFormData}
          newFieldType={newFieldType}
          setNewFieldType={setNewFieldType}
          onFieldDragEnd={handleFieldDragEnd}
          onFieldLabelChange={handleFieldLabelChange}
          onFieldRemove={handleFieldRemove}
          onFieldConditionsChange={handleFieldConditionsChange}
          onCreateDraft={handleCreateDraft}
          onPublishForm={handleCreateForm}
          fieldConfigurations={fieldConfigurations}
          styles={styles}
        />
      ) : (
        <FormDetailEmployeeContent
          formData={formData}
          styles={styles}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
}

export default FormDetailScreen;
