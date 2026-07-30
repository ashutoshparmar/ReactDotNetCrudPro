namespace EmployeeApi.DTOs
{
    public class LoginResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Role { get; set; } = "";
        public string Token { get; set; } = "";
        public string RefreshToken { get; set; } = "";
    }
}