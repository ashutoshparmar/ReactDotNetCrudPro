using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.DTOs
{
    public class EmployeeUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = "";

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
        public string Email { get; set; } = "";

        [Required(ErrorMessage = "Department is required.")]
        [StringLength(100, ErrorMessage = "Department cannot exceed 100 characters.")]
        public string Department { get; set; } = "";

        [Range(1, 999999999, ErrorMessage = "Salary must be greater than 0.")]
        public decimal Salary { get; set; }
    }
}