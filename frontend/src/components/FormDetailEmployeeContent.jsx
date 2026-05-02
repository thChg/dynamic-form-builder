import { useEffect, useMemo, useState } from "react";
import { submitForm } from "../apis/mainServiceApi";
import { useNavigate } from "react-router-dom";

function FormDetailEmployeeContent({ formData, styles, onSubmit }) {
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const initialResponses = {};

    formData.fields.forEach((field) => {
      if (field.type === "select") {
        initialResponses[field.id] = "";
        return;
      }

      if (field.type === "color") {
        initialResponses[field.id] = "#000000";
        return;
      }

      initialResponses[field.id] = "";
    });

    setResponses(initialResponses);
  }, [formData.fields]);

  const getSelectOptions = (field) => {
    const rawOptions = field?.conditions?.options;

    if (Array.isArray(rawOptions)) {
      return rawOptions;
    }

    if (typeof rawOptions === "string" && rawOptions.trim()) {
      try {
        const parsed = JSON.parse(rawOptions);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        return rawOptions
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return rawOptions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getFieldInputType = (field) => {
    switch (field.type) {
      case "email":
      case "date":
      case "number":
      case "color":
        return field.type;
      default:
        return "text";
    }
  };

  const handleResponseChange = (fieldId, value) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const formatConditionValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return String(value);
  };

  const getConditionSummary = (field) => {
    const conditions = field?.conditions || {};

    return Object.entries(conditions)
      .filter(
        ([key, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key !== "required",
      )
      .map(([key, value]) => {
        if (key === "required") {
          return;
        }

        if (key === "options") {
          return `Options: ${formatConditionValue(value)}`;
        }

        return `${key}: ${formatConditionValue(value)}`;
      });
  };

  const filledFieldCount = useMemo(
    () => Object.values(responses).filter((value) => value !== "").length,
    [responses],
  );

  return (
    <div className={styles.content}>
      <div className={styles.section}>
        <p className={styles.employeeNotice}>
          This form is available for employees to fill in.
        </p>

        <div className={styles.employeeSummary}>
          <p className={styles.employeeSummaryTitle}>{formData.title}</p>
          {formData.description ? (
            <p className={styles.employeeSummaryDescription}>
              {formData.description}
            </p>
          ) : null}
        </div>
      </div>

      <form className={styles.section}>
        <div className={styles.fieldHeader}>
          <h2>Fields</h2>
          <span className={styles.fieldNote}>{filledFieldCount} filled</span>
        </div>

        <div className={styles.employeeFieldList}>
          {formData.fields.length > 0 ? (
            formData.fields.map((field) => (
              <label key={field.id} className={styles.employeeFieldCard}>
                <div className={styles.employeeFieldCopy}>
                  <p className={styles.employeeFieldLabel}>
                    {field.label || "Untitled field"}
                    {field.conditions?.required ? (
                      <span className={styles.requiredMark}>*</span>
                    ) : null}
                  </p>
                  <p className={styles.employeeFieldType}>{field.type}</p>
                  {getConditionSummary(field).length > 0 ? (
                    <ul className={styles.employeeConditionList}>
                      {getConditionSummary(field).map((item) => (
                        <li key={item} className={styles.employeeConditionItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {field.type === "select" ? (
                  <select
                    className={styles.employeeControl}
                    value={responses[field.id] || ""}
                    onChange={(event) =>
                      handleResponseChange(field.id, event.target.value)
                    }
                    required={Boolean(field.conditions?.required)}
                  >
                    <option value="">Select an option</option>
                    {getSelectOptions(field).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "color" ? (
                  <div className={styles.colorFieldWrap}>
                    <input
                      className={styles.employeeColorControl}
                      type="color"
                      value={responses[field.id] || "#000000"}
                      onChange={(event) =>
                        handleResponseChange(field.id, event.target.value)
                      }
                    />
                    <span className={styles.colorValue}>
                      {responses[field.id] || "#000000"}
                    </span>
                  </div>
                ) : (
                  <input
                    className={styles.employeeControl}
                    type={getFieldInputType(field)}
                    value={responses[field.id] || ""}
                    onChange={(event) =>
                      handleResponseChange(field.id, event.target.value)
                    }
                    required={Boolean(field.conditions?.required)}
                    placeholder={`Enter ${field.label || field.type}`}
                  />
                )}
              </label>
            ))
          ) : (
            <p className={styles.placeholder}>No fields available.</p>
          )}
        </div>

        <div className={styles.employeeActionRow}>
          <button
            type="button"
            className={styles.employeeSubmitButton}
            onClick={() => onSubmit && onSubmit(responses)}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormDetailEmployeeContent;
