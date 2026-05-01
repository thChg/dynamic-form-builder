import styles from "./FormError.module.css";

function FormError({ message }) {
  if (!message) return null;

  const normalizedMessage = message.trim().replace("Error: ", "");

  return (
    <div className={styles.error} role="alert">
      {normalizedMessage}
    </div>
  );
}

export default FormError;
