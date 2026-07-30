using System.Net;
using System.Text.Json;
using EmployeeApi.DTOs.Common;
using FluentValidation;

namespace EmployeeApi.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException validationEx)
            {
                _logger.LogWarning(validationEx, "Validation error occurred.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                var response = new ErrorResponseDto
                {
                    Message = "Validation failed.",
                    StatusCode = context.Response.StatusCode,
                    Errors = validationEx.Errors.Select(x => x.ErrorMessage).ToList()
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

                var response = new ErrorResponseDto
                {
                    Message = ex.Message,
                    StatusCode = context.Response.StatusCode
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Requested resource not found.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;

                var response = new ErrorResponseDto
                {
                    Message = ex.Message,
                    StatusCode = context.Response.StatusCode
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business validation error occurred.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                var response = new ErrorResponseDto
                {
                    Message = ex.Message,
                    StatusCode = context.Response.StatusCode
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = new ErrorResponseDto
                {
                    Message = "An unexpected error occurred.",
                    StatusCode = context.Response.StatusCode
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
        }
    }
}