using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.DTOs
{
    public class RefreshTokenRequestDto
    {
        [Required]
        public string RefreshToken { get; set; } = "";
    }
}