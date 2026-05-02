import { useCallback, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import FieldConditionModal from "./FieldConditionModal.jsx";
import styles from "./FieldRow.module.css";

function FieldRow({
  field,
  onLabelChange,
  onRemove,
  onConditionsChange,
  isDisabled,
}) {
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: field.id, disabled: isDisabled });
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: field.id,
  });

  const setNodeRef = useCallback(
    (node) => {
      setDraggableNodeRef(node);
      setDroppableNodeRef(node);
    },
    [setDraggableNodeRef, setDroppableNodeRef],
  );

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleConditionsSave = (updatedField) => {
    if (onConditionsChange) {
      onConditionsChange(updatedField);
    }
    setIsConditionModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        styles.fieldRow,
        isDragging ? styles.fieldRowDragging : "",
        isOver ? styles.fieldRowOver : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        className={styles.input}
        type="text"
        value={field.label}
        disabled={isDisabled}
        onChange={(event) => onLabelChange(event.target.value)}
        placeholder="Field label"
      />
      <div className={styles.fieldMeta}>
        <span className={styles.fieldType}>{field.type}</span>
        <button
          type="button"
          className={styles.conditionButton}
          disabled={isDisabled}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setIsConditionModalOpen(true);
          }}
          aria-label="Add conditions"
        >
          ⚙
        </button>
        <button
          type="button"
          className={styles.removeButton}
          disabled={isDisabled}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(field.id);
          }}
          aria-label={`Remove ${field.type} field`}
        >
          <svg
            className={styles.removeIcon}
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          className={styles.dragHandle}
          disabled={isDisabled}
          aria-label={`Drag ${field.label || field.type} field`}
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
      </div>
      {Object.keys(field.conditions || {}).length > 0 && (
        <div className={styles.conditionsDisplay}>
          {Object.entries(field.conditions).map(([key, value]) => (
            <div key={key} className={styles.conditionItem}>
              <span className={styles.conditionKey}>{key}:</span>
              <span className={styles.conditionValue}>
                {typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : Array.isArray(value)
                    ? JSON.stringify(value)
                    : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
      {isConditionModalOpen && (
        <FieldConditionModal
          field={field}
          onClose={() => setIsConditionModalOpen(false)}
          onSave={handleConditionsSave}
        />
      )}
    </div>
  );
}

export default FieldRow;
