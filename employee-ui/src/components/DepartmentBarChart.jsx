import { Paper, Typography, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DepartmentBarChart = ({ rows = [] }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "18px",
        height: 380,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontFamily: '"Outfit", sans-serif' }}>
        Employees by Department
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#d946ef" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}
            vertical={false}
          />
          <XAxis
            dataKey="department"
            stroke={theme.palette.text.secondary}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            stroke={theme.palette.text.secondary}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.05)",
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
            }}
            cursor={{ fill: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.02)" }}
          />
          <Bar
            dataKey="employeeCount"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DepartmentBarChart;