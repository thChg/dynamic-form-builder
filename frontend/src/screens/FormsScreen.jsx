import styles from "./FormsScreen.module.css";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const sampleForms = [
  {
    id: "form-001",
    title: "Client Onboarding",
    description: "Gather project context and key stakeholders.",
    fieldsCount: 12,
    updatedAt: "2 hours ago",
  },
  {
    id: "form-002",
    title: "Hiring Request",
    description: "Request approvals for new hires.",
    fieldsCount: 8,
    updatedAt: "Yesterday",
  },
  {
    id: "form-003",
    title: "IT Access",
    description: "Provision tools and permissions for new teammates.",
    fieldsCount: 6,
    updatedAt: "3 days ago",
  },
];

function FormsScreen() {
  const { user } = useAuth();

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>All forms</p>
          <h1>Forms workspace</h1>
          <p className={styles.subtitle}>
            {user?.email ? `Signed in as ${user.email}.` : "Manage your forms."}
          </p>
        </div>
        <ThemeToggleButton />
      </header>

      <section className={styles.actions}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search forms"
        />
        <button type="button" className={styles.primaryButton}>
          New form
        </button>
      </section>

      <section className={styles.grid}>
        {sampleForms.map((form) => (
          <article key={form.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{form.title}</h2>
              <span className={styles.meta}>{form.updatedAt}</span>
            </div>
            <p className={styles.description}>{form.description}</p>
            <div className={styles.cardFooter}>
              <span>{form.fieldsCount} fields</span>
              <button type="button" className={styles.textButton}>
                Open
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default FormsScreen;
