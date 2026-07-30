using EmployeeApi.DTOs;
using EmployeeApi.Models;
using EmployeeApi.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EmployeeApi.Configuration;
using Microsoft.Extensions.Options;

namespace EmployeeApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IAuthRepository authRepository, IOptions<JwtSettings> jwtOptions)
        {
            _authRepository = authRepository;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _authRepository.GetUserByUsernameAsync(request.Username);

            if (user == null)
                return null;

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

            if (!isPasswordValid)
                return null;

            var accessToken = GenerateJwtToken(user.Id, user.Username, user.Role, user.FullName);
            var refreshToken = GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _authRepository.UpdateRefreshTokenAsync(user.Id, refreshToken, refreshTokenExpiry);

            return new LoginResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role,
                Token = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<int> RegisterAsync(RegisterRequestDto request)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new AppUser
            {
                Username = request.Username,
                Password = passwordHash,
                FullName = request.FullName,
                Role = string.IsNullOrWhiteSpace(request.Role) ? "User" : request.Role
            };

            return await _authRepository.RegisterUserAsync(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDto request)
        {
            var user = await GetUserByIdFromTokenContext(userId);

            if (user == null)
                return false;

            bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);

            if (!isCurrentPasswordValid)
                return false;

            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _authRepository.UpdatePasswordAsync(userId, newPasswordHash);

            return true;
        }

        public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var user = await _authRepository.GetUserByRefreshTokenAsync(request.RefreshToken);

            if (user == null)
                return null;

            if (user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;

            var newAccessToken = GenerateJwtToken(user.Id, user.Username, user.Role, user.FullName);
            var newRefreshToken = GenerateRefreshToken();
            var newRefreshExpiry = DateTime.UtcNow.AddDays(7);

            await _authRepository.UpdateRefreshTokenAsync(user.Id, newRefreshToken, newRefreshExpiry);

            return new TokenResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        private async Task<AppUser?> GetUserByIdFromTokenContext(int userId)
        {
            return await _authRepository.GetUserByIdAsync(userId);
        }

        private string GenerateJwtToken(int userId, string username, string role, string fullName)
        {
            var key = _jwtSettings.Key;
            var issuer = _jwtSettings.Issuer;
            var audience = _jwtSettings.Audience;
            var duration = Convert.ToDouble(_jwtSettings.DurationInMinutes);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("FullName", fullName)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}