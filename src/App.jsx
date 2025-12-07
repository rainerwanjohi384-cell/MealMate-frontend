import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Home from "./pages/Home";
import RecipesList from "./pages/RecipesList";
import AddRecipe from "./pages/AddRecipe";
import Planner from "./pages/Planner";
import Layout from "./components/Layout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user } = useAuth();

  return (
    <Router basename="/MealMate-frontend">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <SignUp />} />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><RecipesList /></ProtectedRoute>} />
          <Route path="/recipes/new" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/recipes/:id" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
