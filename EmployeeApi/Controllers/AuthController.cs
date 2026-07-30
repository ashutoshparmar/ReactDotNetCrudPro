using EmployeeApi.DTOs;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(result, "Login successful."));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<int>.SuccessResponse(result, "User registered successfully."));
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<string>.FailResponse("Invalid change password request."));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim))
                return Unauthorized(ApiResponse<string>.FailResponse("Invalid token."));

            int userId = Convert.ToInt32(userIdClaim);

            var changed = await _authService.ChangePasswordAsync(userId, request);

            if (!changed)
                return BadRequest(ApiResponse<string>.FailResponse("Current password is incorrect."));

            return Ok(ApiResponse<string>.SuccessResponse(null, "Password changed successfully."));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<string>.FailResponse("Invalid refresh token request."));

            var result = await _authService.RefreshTokenAsync(request);

            if (result == null)
                return Unauthorized(ApiResponse<string>.FailResponse("Invalid or expired refresh token."));

            return Ok(ApiResponse<TokenResponseDto>.SuccessResponse(result, "Token refreshed successfully."));
        }
    }
}