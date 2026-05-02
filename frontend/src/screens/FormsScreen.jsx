import { DndContext, closestCenter } from "@dnd-kit/core";
import { useState, useEffect, useRef } from "react";
import styles from "./FormsScreen.module.css";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";
import FormCard from "../components/FormCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import FormError from "../components/Error.jsx";
import { getUserInfo } from "../apis/authServiceApi.js";
import { useNavigate } from "react-router-dom";
import { getForms, deleteForm, reorderForms } from "../apis/mainServiceApi.js";

function FormsScreen() {
  const navigate = useNavigate();
  const { user: savedUser, setUser: setSavedUser } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [forms, setForms] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isAdmin = user?.role === "ADMIN";
  const initialOrderRef = useRef({ published: [], draft: [] });

  const reorderList = (list, activeId, overId) => {
    const activeIndex = list.findIndex((item) => item.id === activeId);
    const overIndex = list.findIndex((item) => item.id === overId);

    if (activeIndex === -1 || overIndex === -1) return list;

    const next = [...list];
    const [moved] = next.splice(activeIndex, 1);
    next.splice(overIndex, 0, moved);
    return next;
  };

  const loadForms = async () => {
    const resp = await getForms();
    const payload = resp?.data ?? resp;

    if (Array.isArray(payload)) {
      const nextForms = payload.filter((form) => form.status === "PUBLISHED");
      const nextDrafts = payload.filter((form) => form.status === "DRAFT");

      setForms(nextForms);
      setDrafts(nextDrafts);

      return {
        published: nextForms.map((form) => form.id),
        draft: nextDrafts.map((form) => form.id),
      };
    }

    return { published: [], draft: [] };
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!savedUser) {
          const response = await getUserInfo();
          setUser(response.data);
          setSavedUser(response.data);
        } else {
          setUser(savedUser);
        }

        const orderSnapshot = await loadForms();
        initialOrderRef.current = orderSnapshot;
      } catch (error) {
        const statusCode = error?.response?.status;
        const message = error?.response?.data?.message || error?.message;
        setError({ message, statusCode });
      }
    };

    init();
  }, [savedUser]);

  const handleDragEnd = ({ active, over }) => {
    if (!isEditMode) return;
    if (!over || active.id === over.id) return;

    setForms((current) => reorderList(current, active.id, over.id));
    setDrafts((current) => reorderList(current, active.id, over.id));
  };

  const haveOrderChanged = (currentIds, initialIds) => {
    if (currentIds.length !== initialIds.length) return true;
    return currentIds.some((id, index) => id !== initialIds[index]);
  };

  const handleEditToggle = async () => {
    if (!isEditMode) {
      initialOrderRef.current = {
        published: forms.map((form) => form.id),
        draft: drafts.map((form) => form.id),
      };
      setIsEditMode(true);
      return;
    }

    const currentOrder = {
      published: forms.map((form) => form.id),
      draft: drafts.map((form) => form.id),
    };

    const orderChanged =
      haveOrderChanged(
        currentOrder.published,
        initialOrderRef.current.published,
      ) || haveOrderChanged(currentOrder.draft, initialOrderRef.current.draft);

    if (!orderChanged) {
      setIsEditMode(false);
      return;
    }

    try {
      setIsSaving(true);
      await reorderForms(currentOrder);
      initialOrderRef.current = currentOrder;
      setIsEditMode(false);
    } catch (error) {
      const statusCode = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;
      setError({ message, statusCode });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormRemove = async (formId) => {
    setForms((current) => current.filter((f) => f.id !== formId));
    setDrafts((current) => current.filter((f) => f.id !== formId));

    try {
      await deleteForm(formId);
      // Sync deletion into the order reference so save payload stays valid
      initialOrderRef.current.published =
        initialOrderRef.current.published.filter((id) => id !== formId);
      initialOrderRef.current.draft = initialOrderRef.current.draft.filter(
        (id) => id !== formId,
      );
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  };
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <FormError message={error.message} statusCode={error.statusCode} />
        <div>
          <p className={styles.eyebrow}>All forms</p>
          <h1>Forms workspace</h1>
          <p className={styles.subtitle}>
            {user?.email ? `Signed in as ${user.email}.` : "Manage your forms."}
          </p>
        </div>
        <div className={styles.headerActions}>
          {isAdmin ? (
            <button
              type="button"
              className={isEditMode ? styles.primaryButton : styles.editToggle}
              onClick={handleEditToggle}
              disabled={isSaving}
            >
              {isEditMode ? (isSaving ? "Saving..." : "Save") : "Edit mode"}
            </button>
          ) : null}
          {isAdmin ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate("/forms/new")}
            >
              New form
            </button>
          ) : null}
          {!isAdmin ? (
            <button
              type="button"
              className={styles.editToggle}
              onClick={() => navigate("/forms/submissions")}
            >
              See all submissions
            </button>
          ) : null}
          <ThemeToggleButton />
          <LogoutButton />
        </div>
      </header>

      <div className={styles.divider} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {isAdmin ? (
          <section className={styles.section} aria-label="Draft forms">
            <div className={styles.sectionHeader}>
              <h2>Draft forms</h2>
              <span className={styles.sectionMeta}>Admin only</span>
            </div>
            <section
              className={[styles.grid, isEditMode ? styles.gridEditMode : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {drafts.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  isEditable={isEditMode}
                  onRemove={handleFormRemove}
                />
              ))}
            </section>
            <div className={styles.divider} />
          </section>
        ) : null}

        <section className={styles.section} aria-label="Published forms">
          <div className={styles.sectionHeader}>
            <h2>Published forms</h2>
            <span className={styles.sectionMeta}>{forms.length} total</span>
          </div>
          <section
            className={[styles.grid, isEditMode ? styles.gridEditMode : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                isEditable={isEditMode}
                onRemove={handleFormRemove}
              />
            ))}
          </section>
        </section>
      </DndContext>
      <div className={styles.divider} />
    </div>
  );
}

export default FormsScreen;
