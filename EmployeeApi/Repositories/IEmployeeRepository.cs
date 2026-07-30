using EmployeeApi.DTOs;
using EmployeeApi.Models;

namespace EmployeeApi.Repositories
{
    public interface IEmployeeRepository
    {
        Task<(List<Employee> Employees, int TotalCount)> GetEmployeesAsync(string searchTerm, int pageNumber, int pageSize);
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<int> AddEmployeeAsync(Employee employee, int? createdBy);
        Task<bool> UpdateEmployeeAsync(Employee employee, int? updatedBy);
        Task<bool> DeleteEmployeeAsync(int id, int? updatedBy);

        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
        Task<List<DepartmentSummaryDto>> GetDepartmentSummaryAsync();
        Task<List<Employee>> GetAllEmployeesForExportAsync();
        Task<Employee?> GetEmployeeByEmailAsync(string email);
    }
}