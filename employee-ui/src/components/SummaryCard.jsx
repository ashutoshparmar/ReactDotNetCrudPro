import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import {
  PeopleAltOutlined,
  BusinessCenterOutlined,
  MonetizationOnOutlined,
} from "@mui/icons-material";

const SummaryCard = ({ title, value }) => {
  const theme = useTheme();

  // Helper to resolve icon and gradient color based on card title
  const getCardDetails = () => {
    switch (title) {
      case "Total Employees":
        return {
          icon: <PeopleAltOutlined sx={{ fontSize: 28, color: "#6366f1" }} />,
          gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.03) 100%)",
          color: "#6366f1",
        };
      case "Total Departments":
        return {
          icon: <BusinessCenterOutlined sx={{ fontSize: 28, color: "#d946ef" }} />,
          gradient: "linear-gradient(135deg, rgba(217, 70, 239, 0.1) 0%, rgba(217, 70, 239, 0.03) 100%)",
          color: "#d946ef",
        };
      default: // Average Salary
        return {
          icon: <MonetizationOnOutlined sx={{ fontSize: 28, color: "#10b981" }} />,
          gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 100%)",
          color: "#10b981",
        };
    }
  };

  const details = getCardDetails();

  return (
    <Card
      sx={{
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.palette.mode === "dark" 
            ? `0px 12px 30px rgba(0, 0, 0, 0.3)` 
            : `0px 12px 30px rgba(99, 102, 241, 0.06)`,
          borderColor: theme.palette.mode === "dark" 
            ? "rgba(255, 255, 255, 0.1)" 
            : "rgba(99, 102, 241, 0.2)",
        },
      }}
    >
      {/* Dynamic Background Gradient Indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${details.color} 0%, rgba(255,255,255,0) 100%)`,
        }}
      />

      <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: "-1px" }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "14px",
            background: details.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {details.icon}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;