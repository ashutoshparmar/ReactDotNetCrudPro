import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, Container, ThemeProvider, CssBaseline } from "@mui/material";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeForm from "./pages/EmployeeForm";
import DashboardPage from "./pages/DashboardPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAdmin, isLoggedIn } from "./utils/auth";
import { lightTheme, darkTheme } from "./theme";

const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin() ? children : <Navigate to="/employees" replace />;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    // Also set standard HTML class if we want to hook other components
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "background.default",
            color: "text.primary",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <Navbar darkMode={darkMode} onToggleTheme={toggleDarkMode} />

          <Container maxWidth="lg" sx={{ flexGrow: 1, pt: 2, pb: 6 }}>
            <Box className="page-transition">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/employees"
                  element={
                    <PrivateRoute>
                      <EmployeeListPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/employees/add"
                  element={
                    <AdminRoute>
                      <EmployeeForm />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/employees/edit/:id"
                  element={
                    <AdminRoute>
                      <EmployeeForm />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/change-password"
                  element={
                    <PrivateRoute>
                      <ChangePasswordPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </Container>
        </Box>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme={darkMode ? "dark" : "light"}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;