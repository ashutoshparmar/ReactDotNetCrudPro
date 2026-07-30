using EmployeeApi.Models;

namespace EmployeeApi.Repositories
{
    public interface IAuthRepository
    {
        Task<AppUser?> GetUserByUsernameAsync(string username);
        Task<AppUser?> GetUserByIdAsync(int userId);
        Task<int> RegisterUserAsync(AppUser user);
        Task UpdatePasswordAsync(int userId, string passwordHash);
        Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime refreshTokenExpiryTime);
        Task<AppUser?> GetUserByRefreshTokenAsync(string refreshToken);
    }
}