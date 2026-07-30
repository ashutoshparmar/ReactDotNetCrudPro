import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { login } from "../services/authService";
import { saveAuthData } from "../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      const result = response.data.data;

      const userData = {
        id: result.id,
        username: result.username,
        fullName: result.fullName,
        role: result.role,
      };

      saveAuthData(result.token, result.refreshToken, userData);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: theme.palette.mode === "dark" 
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)" 
            : "0px 10px 40px rgba(99, 102, 241, 0.08)",
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 4,
            background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            Sign in to access your employee account
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "16px",
                  borderRadius: "12px",
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Stack>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              mt: 4,
              p: 2.5,
              borderRadius: "14px",
              backgroundColor: theme.palette.mode === "dark" 
                ? "rgba(255, 255, 255, 0.02)" 
                : "rgba(99, 102, 241, 0.02)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>
              Demo Credentials:
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <strong>Admin:</strong> admin / admin123
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>User:</strong> user1 / user123
              </Typography>
            </Stack>
          </Paper>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              New user?{" "}
              <Typography
                component={RouterLink}
                to="/register"
                variant="body2"
                color="primary"
                sx={{ fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                Register here
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;