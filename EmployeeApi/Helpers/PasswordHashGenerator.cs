using BCrypt.Net;

namespace EmployeeApi.Helpers
{
    public static class PasswordHashGenerator
    {
        public static void PrintSampleHashes()
        {
            Console.WriteLine("admin123 => " + BCrypt.Net.BCrypt.HashPassword("admin123"));
            Console.WriteLine("user123 => " + BCrypt.Net.BCrypt.HashPassword("user123"));
        }
    }
}