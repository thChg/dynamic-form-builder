import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import styles from "./FormCard.module.css";

function FormCard({ form, isEditable, onRemove }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    if (!isEditable) {
      navigate(`/forms/${form.id}`);
    }
  };
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: form.id, disabled: !isEditable });
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: form.id,
  });

  const setNodeRef = useCallback(
    (node) => {
      setDraggableNodeRef(node);
      setDroppableNodeRef(node);
    },
    [setDraggableNodeRef, setDroppableNodeRef],
  );

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        styles.card,
        isEditable ? styles.editable : styles.readonly,
        isDragging ? styles.dragging : "",
        isOver ? styles.over : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleCardClick}
      role={isEditable ? undefined : "link"}
      tabIndex={isEditable ? undefined : 0}
      onKeyDown={
        isEditable ? undefined : (e) => e.key === "Enter" && handleCardClick()
      }
    >
      <div className={styles.cardAccent} />

      <div className={styles.cardHeader}>
        <div className={styles.headerCopy}>
          <h2>{form.title}</h2>
        </div>
        {isEditable ? (
          <button
            type="button"
            className={styles.removeButton}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(form.id);
            }}
            aria-label={`Remove ${form.title || "form"}`}
          >
            <svg
              className={styles.removeIcon}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"
                fill="currentColor"
              />
            </svg>
          </button>
        ) : (
          <span className={styles.meta}>{form.updatedAt}</span>
        )}
      </div>

      <p className={styles.description}>{form.description}</p>

      <div className={styles.cardFooter}>
        <span className={styles.footerMeta}>
          {isEditable ? "Drag to reorder" : "Last updated"}
        </span>
        {isEditable ? (
          <button
            type="button"
            className={styles.dragHandle}
            aria-label={`Drag ${form.title || "form"}`}
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        ) : (
          <span className={styles.footerValue}>{form.updatedAt}</span>
        )}
      </div>
    </article>
  );
}

export default FormCard;
