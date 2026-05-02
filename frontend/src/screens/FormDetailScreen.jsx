import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { apiGet, apiPut } from "../apis/api.js";
import FieldRow from "../components/FieldRow.jsx";
import styles from "./FormDetailScreen.module.css";
import { fieldConfigurations } from "../constants/fieldConfiguration.jsx";
import { createForm } from "../apis/mainServiceApi.js";
import Error from "../components/Error.jsx";

function FormDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "new";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [newFieldType, setNewFieldType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

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

  const handleCreateDraft = async () => {
    try {
      if (isNew) {
        await createForm({
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: "DRAFT",
        });
      } else {
        await apiPut(`/api/main-service/forms/${id}`, {
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: "DRAFT",
        });
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
      if (isNew) {
        await createForm({
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: "PUBLISHED",
        });
      } else {
        await apiPut(`/api/main-service/forms/${id}`, {
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: "PUBLISHED",
        });
      }
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

  if (isLoading) {
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

      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.label}>
            Title
            <input
              type="text"
              value={formData.title}
              disabled={formData.status === "PUBLISHED"}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              rows={4}
              value={formData.description}
              disabled={formData.status === "PUBLISHED"}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <div className={styles.section}>
          <div className={styles.fieldHeader}>
            <h2>Fields</h2>
            {formData.status !== "PUBLISHED" && (
              <div className={styles.fieldControls}>
                <select
                  className={styles.select}
                  value={newFieldType}
                  onChange={(event) => setNewFieldType(event.target.value)}
                >
                  {Object.keys(fieldConfigurations).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      fields: [
                        ...prev.fields,
                        {
                          id: crypto.randomUUID(),
                          label: "",
                          type: newFieldType,
                        },
                      ],
                    }))
                  }
                >
                  Add field
                </button>
              </div>
            )}
          </div>

          <div
            className={[
              styles.fieldContainer,
              formData.status === "PUBLISHED"
                ? styles.readonlyFieldContainer
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <DndContext
              onDragEnd={handleFieldDragEnd}
              collisionDetection={closestCenter}
            >
              {formData.fields.map((field) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  isDisabled={formData.status === "PUBLISHED"}
                  onLabelChange={(value) =>
                    handleFieldLabelChange(field.id, value)
                  }
                  onRemove={() => handleFieldRemove(field.id)}
                />
              ))}
            </DndContext>
          </div>
        </div>

        {formData.status !== "PUBLISHED" && (
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleCreateDraft}
            >
              Save draft
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleCreateForm}
            >
              Publish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormDetailScreen;
