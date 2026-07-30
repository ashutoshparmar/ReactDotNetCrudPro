using EmployeeApi.DTOs;

namespace EmployeeApi.Services
{
    public interface IEmployeeService
    {
        Task<PagedResultDto<EmployeeDto>> GetEmployeesAsync(string searchTerm, int pageNumber, int pageSize);
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
        Task<EmployeeDto> AddEmployeeAsync(EmployeeCreateDto dto, int? createdBy);
        Task<EmployeeDto> UpdateEmployeeAsync(int id, EmployeeUpdateDto dto, int? updatedBy);
        Task DeleteEmployeeAsync(int id, int? updatedBy);

        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
        Task<List<DepartmentSummaryDto>> GetDepartmentSummaryAsync();
        Task<byte[]> ExportEmployeesCsvAsync();
    }
}