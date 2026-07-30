using EmployeeApi.DTOs;
using EmployeeApi.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeApi.Repositories
{
    public class EmployeeRepository : BaseRepository, IEmployeeRepository
    {
        public EmployeeRepository(IConfiguration configuration) : base(configuration)
        {
            //_dbHelper = dbHelper;
        }

        public async Task<(List<Employee> Employees, int TotalCount)> GetEmployeesAsync(string searchTerm, int pageNumber, int pageSize)
        {
            var employees = new List<Employee>();
            int totalCount = 0;

            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetEmployees", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@SearchTerm", searchTerm ?? "");
            command.Parameters.AddWithValue("@PageNumber", pageNumber);
            command.Parameters.AddWithValue("@PageSize", pageSize);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                employees.Add(MapEmployee(reader));
            }

            if (await reader.NextResultAsync() && await reader.ReadAsync())
            {
                totalCount = Convert.ToInt32(reader[0]);
            }

            return (employees, totalCount);
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            Employee? employee = null;

            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetEmployeeById", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                employee = MapEmployee(reader);
            }

            return employee;
        }

        public async Task<int> AddEmployeeAsync(Employee employee, int? createdBy)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_AddEmployee", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@Name", employee.Name);
            command.Parameters.AddWithValue("@Email", employee.Email);
            command.Parameters.AddWithValue("@Department", employee.Department);
            command.Parameters.AddWithValue("@Salary", employee.Salary);
            command.Parameters.AddWithValue("@CreatedBy", createdBy ?? (object)DBNull.Value);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync();

            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateEmployeeAsync(Employee employee, int? updatedBy)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_UpdateEmployee", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@Id", employee.Id);
            command.Parameters.AddWithValue("@Name", employee.Name);
            command.Parameters.AddWithValue("@Email", employee.Email);
            command.Parameters.AddWithValue("@Department", employee.Department);
            command.Parameters.AddWithValue("@Salary", employee.Salary);
            command.Parameters.AddWithValue("@UpdatedBy", updatedBy ?? (object)DBNull.Value);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync();

            return Convert.ToInt32(result) > 0;
        }

        public async Task<bool> DeleteEmployeeAsync(int id, int? updatedBy)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_DeleteEmployee", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@UpdatedBy", updatedBy ?? (object)DBNull.Value);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync();

            return Convert.ToInt32(result) > 0;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetEmployeeDashboardSummary", connection);
            command.CommandType = CommandType.StoredProcedure;

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var summary = new DashboardSummaryDto();

            if (await reader.ReadAsync())
            {
                summary.TotalEmployees = Convert.ToInt32(reader["TotalEmployees"]);
                summary.TotalDepartments = Convert.ToInt32(reader["TotalDepartments"]);
                summary.AverageSalary = Convert.ToDecimal(reader["AverageSalary"]);
            }

            return summary;
        }

        public async Task<List<DepartmentSummaryDto>> GetDepartmentSummaryAsync()
        {
            var departments = new List<DepartmentSummaryDto>();

            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetEmployeeDepartmentSummary", connection);
            command.CommandType = CommandType.StoredProcedure;

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                departments.Add(new DepartmentSummaryDto
                {
                    Department = reader["Department"]?.ToString() ?? "",
                    EmployeeCount = Convert.ToInt32(reader["EmployeeCount"]),
                    TotalSalary = Convert.ToDecimal(reader["TotalSalary"]),
                    AverageSalary = Convert.ToDecimal(reader["AverageSalary"])
                });
            }

            return departments;
        }

        public async Task<List<Employee>> GetAllEmployeesForExportAsync()
        {
            var employees = new List<Employee>();

            using var connection = CreateConnection();
            using var command = new SqlCommand(@"
                SELECT Id, Name, Email, Department, Salary, CreatedDate, UpdatedDate
                FROM Employees
                WHERE IsDeleted = 0
                ORDER BY Id DESC", connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                employees.Add(MapEmployee(reader));
            }

            return employees;
        }

        public async Task<Employee?> GetEmployeeByEmailAsync(string email)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetEmployeeByEmail", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@Email", email);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapEmployee(reader);
            }

            return null;
        }

        private Employee MapEmployee(SqlDataReader reader)
        {
            return new Employee
            {
                Id = Convert.ToInt32(reader["Id"]),
                Name = reader["Name"]?.ToString() ?? "",
                Email = reader["Email"]?.ToString() ?? "",
                Department = reader["Department"]?.ToString() ?? "",
                Salary = Convert.ToDecimal(reader["Salary"]),
                CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                UpdatedDate = reader["UpdatedDate"] == DBNull.Value
                    ? null
                    : Convert.ToDateTime(reader["UpdatedDate"])
            };
        }
    }
}