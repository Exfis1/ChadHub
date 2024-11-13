using api.Auth.Model;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;


namespace api.Auth
{
    public static class AuthEndpoints
    {
        public static void AddAuthApi(this WebApplication app)
        {
            //Register
            app.MapPost("api/v1/accounts", async (UserManager<ForumUser> userManager, RegisterUserDto dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user != null)
                {
                    return Results.UnprocessableEntity("Username already taken");
                }

                var newUser = new ForumUser()
                {
                    Email = dto.Email,
                    UserName = dto.UserName
                };
                // TOOD: wrap in transaction
                var createdUserResult = await userManager.CreateAsync(newUser, dto.Password);

                if (!createdUserResult.Succeeded)
                {
                    return Results.UnprocessableEntity();
                }

                await userManager.AddToRoleAsync(newUser, ForumRoles.ForumUser);

                return Results.Created();
            });

            //Login
            app.MapPost("api/v1/login", async (UserManager<ForumUser> userManager, JwtTokenService jwtTokenService, HttpContext httpContext , LoginUserDto dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                {
                    return Results.UnprocessableEntity("Username does not exist");
                }

                var isPasswordValid = await userManager.CheckPasswordAsync(user, dto.Password);

                if (!isPasswordValid)
                {
                    return Results.UnprocessableEntity("Username or password was Incorrect");
                }

                var roles = await userManager.GetRolesAsync(user);

                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var refreshToken = jwtTokenService.CreateRefreshToken(user.Id, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                    //Secure = false
                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

                return Results.Ok(new SuccessfulLoginDto(accessToken));
            });

            app.MapPost("api/v1/accessToken", async (UserManager<ForumUser> userManager, JwtTokenService jwtTokenService, HttpContext httpContext) => 
            {
                if (!httpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
                {
                    return Results.UnprocessableEntity();
                }

                if (!jwtTokenService.TryParseRefreshToken(refreshToken, out var claims))
                {
                    return Results.UnprocessableEntity();
                }

                var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var user = await userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return Results.UnprocessableEntity();
                }

                var roles = await userManager.GetRolesAsync(user);

                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var newRefreshToken = jwtTokenService.CreateRefreshToken(user.Id, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                    //Secure = false
                };

                httpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, cookieOptions);

                return Results.Ok(new SuccessfulLoginDto(accessToken));
            });
        }

        public record RegisterUserDto(string UserName, string Email, string Password);
        public record LoginUserDto(string UserName, string Password);
        public record SuccessfulLoginDto (string AccessToken);
    }
        
}
