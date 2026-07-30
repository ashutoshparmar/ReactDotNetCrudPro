using EmployeeApi.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeApi.Repositories
{
    public class AuthRepository : BaseRepository, IAuthRepository
    {
        public AuthRepository(IConfiguration configuration) : base(configuration)
        {
        }
        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            AppUser? user = null;

            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetUserByUsername", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Username", username);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                user = MapUser(reader);
            }

            return user;
        }

        public async Task<int> RegisterUserAsync(AppUser user)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_RegisterUser", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@Username", user.Username);
            command.Parameters.AddWithValue("@Password", user.Password);
            command.Parameters.AddWithValue("@FullName", user.FullName);
            command.Parameters.AddWithValue("@Role", user.Role);

            await connection.OpenAsync();

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task UpdatePasswordAsync(int userId, string passwordHash)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_UpdateUserPassword", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@Password", passwordHash);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime refreshTokenExpiryTime)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_UpdateRefreshToken", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@RefreshToken", refreshToken);
            command.Parameters.AddWithValue("@RefreshTokenExpiryTime", refreshTokenExpiryTime);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public async Task<AppUser?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            AppUser? user = null;

            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetUserByRefreshToken", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@RefreshToken", refreshToken);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                user = MapUser(reader);
            }

            return user;
        }

        public async Task<AppUser?> GetUserByIdAsync(int userId)
        {
            AppUser? user = null;

            using var connection = CreateConnection();
            using var command = new SqlCommand("sp_GetUserById", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@UserId", userId);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                user = MapUser(reader);
            }

            return user;
        }
        private AppUser MapUser(SqlDataReader reader)
        {
            return new AppUser
            {
                Id = Convert.ToInt32(reader["Id"]),
                Username = reader["Username"]?.ToString() ?? "",
                Password = reader["Password"]?.ToString() ?? "",
                FullName = reader["FullName"]?.ToString() ?? "",
                Role = reader["Role"]?.ToString() ?? "",
                RefreshToken = reader["RefreshToken"] == DBNull.Value ? null : reader["RefreshToken"].ToString(),
                RefreshTokenExpiryTime = reader["RefreshTokenExpiryTime"] == DBNull.Value
                    ? null
                    : Convert.ToDateTime(reader["RefreshTokenExpiryTime"])
            };
        }
    }
}