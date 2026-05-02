import { useAuth } from "../context/AuthContext";
import styles from "./Error.module.css";

function Error({ message, statusCode }) {
  const { logout } = useAuth();
  if (!message) return null;
  if (statusCode === 403) {
    logout();
  }

  const normalizedMessage = message.trim().replace("Error: ", "");

  return (
    <div className={styles.error} role="alert">
      {normalizedMessage}
    </div>
  );
}

export default Error;
