import { useAuth } from "./context/AuthContext.jsx";
import AuthScreen from "./screens/AuthScreen.jsx";
import FormsScreen from "./screens/FormsScreen.jsx";
import FormDetailScreen from "./screens/FormDetailScreen.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthScreen />} />
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <FormsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/:id"
        element={
          <ProtectedRoute>
            <FormDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/forms" />} />
    </Routes>
  );
}

export default App;
