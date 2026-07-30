using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.DTOs
{
    public class RegisterRequestDto
    {
        [Required]
        public string Username { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";

        [Required]
        public string FullName { get; set; } = "";

        public string Role { get; set; } = "User";
    }
}