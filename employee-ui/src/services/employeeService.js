import apiClient from "./apiClient";

export const getEmployees = (search = "", pageNumber = 1, pageSize = 5) => {
  return apiClient.get("/employee", {
    params: { search, pageNumber, pageSize }
  });
};

export const getEmployeeById = (id) => {
  return apiClient.get(`/employee/${id}`);
};

export const addEmployee = (employee) => {
  return apiClient.post("/employee", employee);
};

export const updateEmployee = (id, employee) => {
  return apiClient.put(`/employee/${id}`, employee);
};

export const deleteEmployee = (id) => {
  return apiClient.delete(`/employee/${id}`);
};

export const getDashboardSummary = () => {
  return apiClient.get("/employee/dashboard-summary");
};

export const getDepartmentSummary = () => {
  return apiClient.get("/employee/department-summary");
};

export const exportEmployees = () => {
  return apiClient.get("/employee/export", {
    responseType: "blob"
  });
};