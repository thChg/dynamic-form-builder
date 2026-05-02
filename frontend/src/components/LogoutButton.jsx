import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./LogoutButton.module.css";

function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <button
      type="button"
      className={styles.logoutButton}
      onClick={handleLogout}
      aria-label="Logout"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
