import { useState } from "react";
import { createPortal } from "react-dom";
import { fieldConfigurations } from "../constants/fieldConfiguration.jsx";
import styles from "./FieldConditionModal.module.css";

function FieldConditionModal({ field, onClose, onSave }) {
  const [conditions, setConditions] = useState(field.conditions || {});

  const fieldConfig = fieldConfigurations[field.type] || {};
  const conditionEntries = Object.entries(fieldConfig);

  const handleConditionChange = (key, value) => {
    setConditions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNumberConditionChange = (key, rawValue) => {
    if (rawValue === "") {
      setConditions((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }

    handleConditionChange(key, Number(rawValue));
  };

  const handleSave = () => {
    onSave({ ...field, conditions });
  };

  const renderConditionInput = (key, type) => {
    const value = conditions[key];

    switch (type) {
      case "boolean":
        return (
          <label key={key} className={styles.requiredRow}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleConditionChange(key, e.target.checked)}
            />
            <span>{key}</span>
          </label>
        );

      case "number":
        return (
          <div key={key} className={styles.conditionRow}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              type="number"
              value={value || ""}
              onChange={(e) => handleNumberConditionChange(key, e.target.value)}
              placeholder={`Enter ${key}`}
            />
          </div>
        );

      case "date":
        return (
          <div key={key} className={styles.conditionRow}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              type="date"
              value={value || ""}
              onChange={(e) => handleConditionChange(key, e.target.value)}
            />
          </div>
        );

      case "array":
        return (
          <div key={key} className={styles.conditionRow}>
            <label htmlFor={key}>{key}</label>
            <textarea
              id={key}
              value={value || ""}
              onChange={(e) => {
                handleConditionChange(key, e.target.value);
              }}
              placeholder="Enter JSON array"
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>Conditions for {field.label || "Field"}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <div className={styles.content}>
          {conditionEntries.length > 0 ? (
            <div className={styles.conditionsForm}>
              {conditionEntries.map(([key, type]) =>
                renderConditionInput(key, type),
              )}
            </div>
          ) : (
            <p className={styles.placeholder}>
              No conditions available for {field.type} field.
            </p>
          )}
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            Save conditions
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export default FieldConditionModal;
