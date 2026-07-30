import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import SummaryCard from "../components/SummaryCard";
import DepartmentSummaryTable from "../components/DepartmentSummaryTable";
import DepartmentBarChart from "../components/DepartmentBarChart";
import Loader from "../components/Loader";
import {
  getDashboardSummary,
  getDepartmentSummary
} from "../services/employeeService";
import { toast } from "react-toastify";

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  });
};

const DashboardPage = () => {
  const theme = useTheme();
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0
  });
  const [departmentRows, setDepartmentRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, departmentRes] = await Promise.all([
        getDashboardSummary(),
        getDepartmentSummary()
      ]);

      setSummary(summaryRes.data.data || {});
      setDepartmentRows(departmentRes.data.data || []);
    } catch (error) {
      console.error("Dashboard load failed:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: "-1.5px" }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track employee distribution, financial metrics, and department breakdowns.
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Total Employees"
            value={summary.totalEmployees ?? 0}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Total Departments"
            value={summary.totalDepartments ?? 0}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Average Salary"
            value={formatCurrency(summary.averageSalary ?? 0)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <DepartmentBarChart rows={departmentRows} />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "18px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontFamily: '"Outfit", sans-serif' }}>
              Department Summary
            </Typography>

            <DepartmentSummaryTable rows={departmentRows} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;