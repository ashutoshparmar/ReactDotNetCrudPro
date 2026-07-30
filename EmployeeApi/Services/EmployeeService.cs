using EmployeeApi.DTOs;
using EmployeeApi.Models;
using EmployeeApi.Repositories;
using System.Text;

namespace EmployeeApi.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<PagedResultDto<EmployeeDto>> GetEmployeesAsync(string searchTerm, int pageNumber, int pageSize)
        {
            var (employees, totalCount) = await _employeeRepository.GetEmployeesAsync(searchTerm, pageNumber, pageSize);

            var employeeDtos = employees.Select(emp => new EmployeeDto
            {
                Id = emp.Id,
                Name = emp.Name,
                Email = emp.Email,
                Department = emp.Department,
                Salary = emp.Salary,
                CreatedDate = emp.CreatedDate,
                UpdatedDate = emp.UpdatedDate
            }).ToList();

            return new PagedResultDto<EmployeeDto>
            {
                Data = employeeDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<EmployeeDto> GetEmployeeByIdAsync(int id)
        {
            var emp = await _employeeRepository.GetEmployeeByIdAsync(id);

            if (emp == null)
                throw new KeyNotFoundException("Employee not found.");

            return new EmployeeDto
            {
                Id = emp.Id,
                Name = emp.Name,
                Email = emp.Email,
                Department = emp.Department,
                Salary = emp.Salary,
                CreatedDate = emp.CreatedDate,
                UpdatedDate = emp.UpdatedDate
            };
        }

        public async Task<EmployeeDto> AddEmployeeAsync(EmployeeCreateDto request, int? createdBy)
        {
            var existingEmployee = await _employeeRepository.GetEmployeeByEmailAsync(request.Email);
            if (existingEmployee != null)
                throw new InvalidOperationException("An employee with this email already exists.");

            var employee = new Employee
            {
                Name = request.Name.Trim(),
                Email = request.Email.Trim(),
                Department = request.Department.Trim(),
                Salary = request.Salary,
                CreatedDate = DateTime.UtcNow
            };

            var newId = await _employeeRepository.AddEmployeeAsync(employee, createdBy);
            employee.Id = newId;

            return new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Department = employee.Department,
                Salary = employee.Salary,
                CreatedDate = employee.CreatedDate,
                UpdatedDate = employee.UpdatedDate
            };
        }

        public async Task<EmployeeDto> UpdateEmployeeAsync(int id, EmployeeUpdateDto request, int? updatedBy)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(id);

            if (employee == null)
                throw new KeyNotFoundException("Employee not found.");

            var employeeWithSameEmail = await _employeeRepository.GetEmployeeByEmailAsync(request.Email);
            if (employeeWithSameEmail != null && employeeWithSameEmail.Id != id)
                throw new InvalidOperationException("Another employee with this email already exists.");

            employee.Name = request.Name.Trim();
            employee.Email = request.Email.Trim();
            employee.Department = request.Department.Trim();
            employee.Salary = request.Salary;
            employee.UpdatedDate = DateTime.UtcNow;

            await _employeeRepository.UpdateEmployeeAsync(employee, updatedBy);

            return new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Department = employee.Department,
                Salary = employee.Salary,
                CreatedDate = employee.CreatedDate,
                UpdatedDate = employee.UpdatedDate
            };
        }

        public async Task DeleteEmployeeAsync(int id, int? updatedBy)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(id);

            if (employee == null)
                throw new KeyNotFoundException("Employee not found.");

            await _employeeRepository.DeleteEmployeeAsync(id,updatedBy);
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            return await _employeeRepository.GetDashboardSummaryAsync();
        }

        public async Task<List<DepartmentSummaryDto>> GetDepartmentSummaryAsync()
        {
            return await _employeeRepository.GetDepartmentSummaryAsync();
        }

        public async Task<byte[]> ExportEmployeesCsvAsync()
        {
            var employees = await _employeeRepository.GetAllEmployeesForExportAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Id,Name,Email,Department,Salary,CreatedDate,UpdatedDate");

            foreach (var emp in employees)
            {
                sb.AppendLine(
                    $"{emp.Id}," +
                    $"{EscapeCsv(emp.Name)}," +
                    $"{EscapeCsv(emp.Email)}," +
                    $"{EscapeCsv(emp.Department)}," +
                    $"{emp.Salary}," +
                    $"{emp.CreatedDate:yyyy-MM-dd HH:mm:ss}," +
                    $"{(emp.UpdatedDate.HasValue ? emp.UpdatedDate.Value.ToString("yyyy-MM-dd HH:mm:ss") : "")}"
                );
            }

            return Encoding.UTF8.GetBytes(sb.ToString());
        }
        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value))
                return "\"\"";

            return $"\"{value.Replace("\"", "\"\"")}\"";
        }
    }
}