import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

const DepartmentSummaryTable = ({ rows = [] }) => {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 450 }}>
        <TableHead>
          <TableRow>
            <TableCell>Department</TableCell>
            <TableCell align="right">Employees</TableCell>
            <TableCell align="right">Total Salary</TableCell>
            <TableCell align="right">Average Salary</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography sx={{ py: 3 }} color="text.secondary">
                  No department summary available.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${row.department}-${index}`}
                sx={{
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.02)" 
                      : "rgba(99, 102, 241, 0.01)",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{row.department}</TableCell>
                <TableCell align="right">{row.employeeCount}</TableCell>
                <TableCell align="right">{formatCurrency(row.totalSalary)}</TableCell>
                <TableCell align="right">{formatCurrency(row.averageSalary)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DepartmentSummaryTable;