using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.DTOs
{
    public class ChangePasswordRequestDto
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required]
        public string NewPassword { get; set; } = "";
    }
}