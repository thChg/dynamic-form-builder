import { DndContext, closestCenter } from "@dnd-kit/core";
import FieldRow from "./FieldRow.jsx";

function FormDetailAdminContent({
  formData,
  setFormData,
  newFieldType,
  setNewFieldType,
  onFieldDragEnd,
  onFieldLabelChange,
  onFieldRemove,
  onFieldConditionsChange,
  onCreateDraft,
  onPublishForm,
  fieldConfigurations,
  styles,
}) {
  const isReadOnly = formData.status === "PUBLISHED";

  return (
    <div className={styles.content}>
      <div className={styles.section}>
        <label className={styles.label}>
          Title
          <input
            type="text"
            value={formData.title}
            disabled={isReadOnly}
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
            disabled={isReadOnly}
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
          {!isReadOnly && (
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
                        conditions: {},
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
            isReadOnly ? styles.readonlyFieldContainer : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <DndContext
            onDragEnd={onFieldDragEnd}
            collisionDetection={closestCenter}
          >
            {formData.fields.map((field) => (
              <FieldRow
                key={field.id}
                field={field}
                isDisabled={isReadOnly}
                onLabelChange={(value) => onFieldLabelChange(field.id, value)}
                onRemove={() => onFieldRemove(field.id)}
                onConditionsChange={onFieldConditionsChange}
              />
            ))}
          </DndContext>
        </div>
      </div>

      {!isReadOnly && (
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onCreateDraft}
          >
            Save draft
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onPublishForm}
          >
            Publish
          </button>
        </div>
      )}
    </div>
  );
}

export default FormDetailAdminContent;
