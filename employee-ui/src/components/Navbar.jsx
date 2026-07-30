import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  ExitToApp,
  VpnKey,
  DashboardOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser, getToken } from "../utils/auth";

const Navbar = ({ darkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const token = getToken();
  const user = getUser();

  // Menu state for profile dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    handleMenuClose();
    navigate("/change-password");
  };

  // Get initials for profile avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const isSelected = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: darkMode
          ? "rgba(11, 15, 25, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: "text.primary",
        mb: 4,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          py: 0.5,
        }}
      >
        {/* Brand & Left Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "primary.main",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontFamily: '"Outfit", sans-serif',
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              E
            </Box>
            Portal
          </Typography>

          {token && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                color={isSelected("/dashboard") ? "primary" : "inherit"}
                component={RouterLink}
                to="/dashboard"
                startIcon={<DashboardOutlined />}
                sx={{
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.8,
                  fontWeight: isSelected("/dashboard") ? 700 : 500,
                  backgroundColor: isSelected("/dashboard")
                    ? darkMode
                      ? "rgba(129, 140, 248, 0.08)"
                      : "rgba(99, 102, 241, 0.05)"
                    : "transparent",
                }}
              >
                Dashboard
              </Button>

              <Button
                color={isSelected("/employees") ? "primary" : "inherit"}
                component={RouterLink}
                to="/employees"
                startIcon={<PeopleAltOutlined />}
                sx={{
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.8,
                  fontWeight: isSelected("/employees") ? 700 : 500,
                  backgroundColor: isSelected("/employees")
                    ? darkMode
                      ? "rgba(129, 140, 248, 0.08)"
                      : "rgba(99, 102, 241, 0.05)"
                    : "transparent",
                }}
              >
                Employees
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Section: Toggles & User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Dark Mode Toggler */}
          <IconButton
            onClick={onToggleTheme}
            color="inherit"
            sx={{
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              p: 1,
            }}
          >
            {darkMode ? (
              <LightModeOutlined sx={{ fontSize: 20 }} />
            ) : (
              <DarkModeOutlined sx={{ fontSize: 20 }} />
            )}
          </IconButton>

          {token ? (
            <>
              {/* Profile Menu Trigger */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0.5,
                  border: `2px solid ${theme.palette.primary.light}`,
                  borderRadius: "12px",
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "14px",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
                    color: "#ffffff",
                  }}
                >
                  {getInitials(user?.fullName || user?.username)}
                </Avatar>
              </IconButton>

              {/* Profile Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                elevation={3}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: "14px",
                      overflow: "visible",
                      boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)",
                      border: `1px solid ${theme.palette.divider}`,
                    },
                  },
                }}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {user?.fullName || user?.username || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.username}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      display: "inline-block",
                      px: 1,
                      py: 0.2,
                      fontSize: "11px",
                      fontWeight: 700,
                      borderRadius: "6px",
                      backgroundColor:
                        user?.role === "Admin"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(16, 185, 129, 0.1)",
                      color: user?.role === "Admin" ? "error.main" : "success.main",
                    }}
                  >
                    {user?.role || "User"}
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Menu Items */}
                <MenuItem onClick={handleChangePassword}>
                  <ListItemIcon>
                    <VpnKey fontSize="small" />
                  </ListItemIcon>
                  Change Password
                </MenuItem>

                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ borderRadius: "8px", fontWeight: 600 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{ borderRadius: "8px", fontWeight: 600 }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;