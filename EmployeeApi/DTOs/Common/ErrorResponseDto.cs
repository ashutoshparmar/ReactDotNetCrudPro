namespace EmployeeApi.DTOs.Common
{
    public class ErrorResponseDto
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = "An error occurred.";
        public List<string> Errors { get; set; } = new();
        public int StatusCode { get; set; }
    }
}