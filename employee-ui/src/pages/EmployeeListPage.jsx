import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  TableSortLabel,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Edit, Delete, Add, Download, SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteEmployee,
  exportEmployees,
  getEmployees,
} from "../services/employeeService";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import { downloadBlobFile } from "../utils/fileDownload";
import { isAdmin } from "../utils/auth";

const PAGE_SIZE = 5;

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

const compareValues = (a, b, orderBy) => {
  const valueA = a?.[orderBy];
  const valueB = b?.[orderBy];

  if (valueA == null && valueB == null) return 0;
  if (valueA == null) return -1;
  if (valueB == null) return 1;

  if (orderBy === "salary") {
    return Number(valueA) - Number(valueB);
  }

  if (orderBy === "createdDate" || orderBy === "updatedDate") {
    return new Date(valueA).getTime() - new Date(valueB).getTime();
  }

  return String(valueA).localeCompare(String(valueB));
};

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const userIsAdmin = isAdmin();

  const [employees, setEmployees] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [orderBy, setOrderBy] = useState("createdDate");
  const [orderDirection, setOrderDirection] = useState("desc");

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getEmployees(searchTerm, pageNumber, PAGE_SIZE);
      const apiData = response.data?.data;

      setEmployees(apiData?.data || []);
      setTotalCount(apiData?.totalCount || 0);
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageNumber]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageNumber(1);
      setSearchTerm(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const sortedEmployees = useMemo(() => {
    const copied = [...employees];

    copied.sort((a, b) => {
      const result = compareValues(a, b, orderBy);
      return orderDirection === "asc" ? result : -result;
    });

    return copied;
  }, [employees, orderBy, orderDirection]);

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrderDirection("asc");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployeeId) return;

    try {
      setLoading(true);
      await deleteEmployee(selectedEmployeeId);
      toast.success("Employee deleted successfully.");
      setDeleteDialogOpen(false);
      setSelectedEmployeeId(null);

      if (employees.length === 1 && pageNumber > 1) {
        setPageNumber((prev) => prev - 1);
      } else {
        await loadEmployees();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await exportEmployees();
      const fileName =
        response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "employees.csv";

      downloadBlobFile(response.data, fileName);
      toast.success("Employee export downloaded.");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export employees.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ py: 1 }}>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: "-1.5px" }}>
            Employees Directory
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            Manage, filter, sort, and export employee profile information.
          </Typography>
        </Box>

        {userIsAdmin && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Download />}
              onClick={handleExport}
              sx={{ borderRadius: "10px" }}
            >
              Export CSV
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate("/employees/add")}
              sx={{ borderRadius: "10px" }}
            >
              Add Employee
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Search Input Box */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "16px",
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <TextField
          placeholder="Search by employee name or department..."
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: "text.secondary", mr: 0.5 }} />
                </InputAdornment>
              ),
            }
          }}
        />
      </Paper>

      {/* Employees Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? orderDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>

              <TableCell>Email</TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "department"}
                  direction={orderBy === "department" ? orderDirection : "asc"}
                  onClick={() => handleSort("department")}
                >
                  Department
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "salary"}
                  direction={orderBy === "salary" ? orderDirection : "asc"}
                  onClick={() => handleSort("salary")}
                >
                  Salary
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdDate"}
                  direction={orderBy === "createdDate" ? orderDirection : "asc"}
                  onClick={() => handleSort("createdDate")}
                >
                  Created Date
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "updatedDate"}
                  direction={orderBy === "updatedDate" ? orderDirection : "asc"}
                  onClick={() => handleSort("updatedDate")}
                >
                  Updated Date
                </TableSortLabel>
              </TableCell>

              {userIsAdmin && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userIsAdmin ? 7 : 6} align="center">
                  <Typography sx={{ py: 4 }} color="text.secondary">
                    No employees found matching the search criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  sx={{
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.02)" 
                        : "rgba(99, 102, 241, 0.01)",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    {formatCurrency(emp.salary)}
                  </TableCell>
                  <TableCell>{formatDate(emp.createdDate)}</TableCell>
                  <TableCell>{formatDate(emp.updatedDate)}</TableCell>

                  {userIsAdmin && (
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                          size="small"
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "8px",
                            color: "primary.main",
                          }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDeleteClick(emp.id)}
                          color="error"
                          size="small"
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "8px",
                            color: "error.main",
                          }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 0 && (
        <Stack sx={{ alignItems: "center" }} mt={4}>
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={(_, value) => setPageNumber(value)}
            color="primary"
            variant="outlined"
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Stack>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Employee"
        message="Are you sure you want to permanently delete this employee? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedEmployeeId(null);
        }}
      />
    </Box>
  );
};

export default EmployeeListPage;