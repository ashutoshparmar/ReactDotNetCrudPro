import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  BadgeOutlined,
  EmailOutlined,
  BusinessOutlined,
  MonetizationOnOutlined,
  Save,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addEmployee,
  getEmployeeById,
  updateEmployee,
} from "../services/employeeService";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { isAdmin } from "../utils/auth";

const initialForm = {
  id: 0,
  name: "",
  email: "",
  department: "",
  salary: "",
};

const EmployeeForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const userIsAdmin = isAdmin();

  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loadEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      const emp = response.data?.data;

      setFormData({
        id: emp.id,
        name: emp.name || "",
        email: emp.email || "",
        department: emp.department || "",
        salary: emp.salary || "",
      });
    } catch (error) {
      console.error("Failed to load employee:", error);
      toast.error("Failed to load employee details.");
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!userIsAdmin) {
      toast.error("You are not authorized to access this page.");
      navigate("/employees");
      return;
    }

    if (isEditMode) {
      loadEmployee();
    }
  }, [userIsAdmin, isEditMode, loadEmployee, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.department.trim()) {
      errors.department = "Department is required.";
    }

    if (!formData.salary || Number(formData.salary) <= 0) {
      errors.salary = "Salary must be greater than 0.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        id: formData.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        salary: Number(formData.salary),
      };

      if (isEditMode) {
        await updateEmployee(id, payload);
        toast.success("Employee updated successfully.");
      } else {
        await addEmployee(payload);
        toast.success("Employee added successfully.");
      }

      navigate("/employees");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(error?.response?.data?.message || "Failed to save employee.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ py: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 650, mb: 3 }}>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/employees")}
          sx={{ borderRadius: "8px", mb: 2 }}
        >
          Back to Directory
        </Button>

        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: "-1.5px" }}>
          {isEditMode ? "Edit Employee Profile" : "Create Employee Profile"}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          {isEditMode
            ? "Modify current employee account parameters."
            : "Register a new employee record within the directory database."}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "20px",
          width: "100%",
          maxWidth: 650,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
              error={!!fieldErrors.department}
              helperText={fieldErrors.department}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              fullWidth
              error={!!fieldErrors.salary}
              helperText={fieldErrors.salary}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                sx={{ px: 3, py: 1.2, borderRadius: "10px" }}
              >
                {isEditMode ? "Update Profile" : "Save Profile"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/employees")}
                sx={{ px: 3, py: 1.2, borderRadius: "10px" }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;