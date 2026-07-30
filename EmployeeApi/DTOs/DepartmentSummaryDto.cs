namespace EmployeeApi.DTOs
{
    public class DepartmentSummaryDto
    {
        public string Department { get; set; } = "";
        public int EmployeeCount { get; set; }
        public decimal TotalSalary { get; set; }
        public decimal AverageSalary { get; set; }
    }
}