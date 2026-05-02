import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SubmissionsScreen.module.css";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";
import FormError from "../components/Error.jsx";
import { getMySubmissions } from "../apis/mainServiceApi.js";

function SubmissionsScreen() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getMySubmissions();
        const payload = response?.data ?? response;
        setSubmissions(Array.isArray(payload) ? payload : []);
      } catch (err) {
        const statusCode = err?.response?.status;
        const message = err?.response?.data?.message || err?.message;
        setError({ message, statusCode });
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Employee</p>
          <h1>All submissions</h1>
          <p className={styles.subtitle}>Review your submitted form answers.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/forms")}
          >
            Back to forms
          </button>
          <ThemeToggleButton />
          <LogoutButton />
        </div>
      </header>

      <FormError message={error.message} statusCode={error.statusCode} />
      <div className={styles.divider} />

      {isLoading ? (
        <p className={styles.emptyText}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p className={styles.emptyText}>No submissions found yet.</p>
      ) : (
        <section className={styles.list}>
          {submissions.map((submission) => (
            <article key={submission.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{submission.form?.title || "Untitled form"}</h2>
                <span className={styles.submissionDate}>
                  {submission.createdAt
                    ? new Date(submission.createdAt).toLocaleString()
                    : "-"}
                </span>
              </div>

              <div className={styles.responses}>
                {(submission.responses || []).map((response) => (
                  <div
                    key={`${submission.id}-${response.id}`}
                    className={styles.responseRow}
                  >
                    <span className={styles.fieldLabel}>
                      {response.field?.label || `Field ${response.fieldId}`}
                    </span>
                    <span className={styles.fieldValue}>{response.value}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default SubmissionsScreen;
