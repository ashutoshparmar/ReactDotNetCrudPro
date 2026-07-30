using EmployeeApi.DTOs;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetEmployees(
        [FromQuery] string? search = "",
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5)
        {
            var result = await _employeeService.GetEmployeesAsync(search, pageNumber, pageSize);
            return Ok(ApiResponse<object>.SuccessResponse(result, "Employees fetched successfully."));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var result = await _employeeService.GetEmployeeByIdAsync(id);
            return Ok(ApiResponse<EmployeeDto>.SuccessResponse(result, "Employee fetched successfully."));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateDto request)
        {
            int? userId = GetCurrentUserId();
            var result = await _employeeService.AddEmployeeAsync(request, userId);
            return Ok(ApiResponse<EmployeeDto>.SuccessResponse(result, "Employee added successfully."));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateDto request)
        {
            int? userId = GetCurrentUserId();
            var result = await _employeeService.UpdateEmployeeAsync(id,request, userId);
            return Ok(ApiResponse<EmployeeDto>.SuccessResponse(result, "Employee updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            int? userId = GetCurrentUserId();
            await _employeeService.DeleteEmployeeAsync(id, userId);
            return Ok(ApiResponse<string>.SuccessResponse(null, "Employee deleted successfully."));
        }

        [HttpGet("dashboard-summary")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = await _employeeService.GetDashboardSummaryAsync();
            return Ok(ApiResponse<DashboardSummaryDto>.SuccessResponse(summary));
        }

        [HttpGet("department-summary")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetDepartmentSummary()
        {
            var summary = await _employeeService.GetDepartmentSummaryAsync();
            return Ok(ApiResponse<List<DepartmentSummaryDto>>.SuccessResponse(summary));
        }

        [HttpGet("export")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExportEmployees()
        {
            var fileBytes = await _employeeService.ExportEmployeesCsvAsync();

            return File(fileBytes, "text/csv", $"employees_{DateTime.Now:yyyyMMddHHmmss}.csv");
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim))
                return null;

            return Convert.ToInt32(userIdClaim);
        }

        private string GetValidationMessage()
        {
            var firstError = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .FirstOrDefault();

            return string.IsNullOrWhiteSpace(firstError) ? "Invalid request." : firstError;
        }
    }
}