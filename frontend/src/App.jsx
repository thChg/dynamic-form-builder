import { useAuth } from "./context/AuthContext.jsx";
import AuthScreen from "./screens/AuthScreen.jsx";
import FormsScreen from "./screens/FormsScreen.jsx";

function App() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? <FormsScreen /> : <AuthScreen />;
}

export default App;
