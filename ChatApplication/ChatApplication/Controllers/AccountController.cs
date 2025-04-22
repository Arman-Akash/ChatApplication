using ChatApplication.Data;
using ChatApplication.Models;
using ChatApplication.ServiceModels;
using ChatApplication.Utility;
using ChatApplication.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly AuthConfiguration _authConfiguration;
        private readonly ILogError _logError;
        private readonly IWebHostEnvironment _env;
        private readonly string _folder = "users";

        public AccountController(ChatDbContext _context,
            IOptions<AuthConfiguration> configuration,
            IWebHostEnvironment env,
            ILogError logError)
        {
            this._context = _context;
            _authConfiguration = configuration.Value;
            _env = env;
            _logError = logError;
        }

        [HttpGet("Profile")]
        public async Task<Result<User>> Profile()
        {
            var userId = User.GetUserId();

            var result = new Result<User>
            {
                Data = await _context.Users
                    .Where(e => e.Id == userId)
                    .Select(e => new User
                    {
                        Id = e.Id,
                        DOB = e.DOB,
                        Name = e.Name,
                        Address = e.Address,
                        Username = e.Username,
                        Photo = e.Photo
                    })
                    .FirstOrDefaultAsync()
            };

            return result;
        }

        [HttpPost("CreateUser")]
        [AllowAnonymous]
        public async Task<Result> CreateUser([FromForm] UserRegistration newUser, IFormFile photo)
        {
            var result = new Result();
            try
            {
                var user = new User();
                (user.Salt, user.Hash) = PasswordManager.HashPassword(newUser.Password);
                user.Role = "Client";
                user.Username = newUser.Username;
                user.Name = newUser.Name;
                user.DOB = newUser.DOB;
                user.IsActive = true;

                if (photo != null)
                {
                    var filename = await FileManager.UploadImage(Path.Combine(_env.WebRootPath, _folder), photo);
                    if (filename != null)
                    {
                        user.Photo = _folder + "/" + filename;
                    }
                }
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                result.Success = true;
            }
            catch (Exception exp)
            {
                _logError.Error(exp);
                result.Success = false;
                result.Message = exp.Message;
                if (exp.InnerException.Message.Contains("duplicate key"))
                {
                    result.Message = "Email is already used";
                }
                else
                {
                    result.Message = "Internal Server Error!";
                }
            }

            return result;
        }

        [HttpPut("updateUser/{id}")]
        public async Task<Result> UpdateUser(int id, User updatedUser)
        {
            var result = new Result();
            if (id != updatedUser.Id)
            {
                result.Message = "Bad Request";
                result.Success = false;
                return result;
            }
            try
            {
                var user = _context.Users
                .Where(e => e.Id == updatedUser.Id)
                .FirstOrDefault();

                if (user == null)
                    throw new NullReferenceException();

                if (!string.IsNullOrWhiteSpace(updatedUser.Password))
                    (user.Salt, user.Hash) = PasswordManager.HashPassword(updatedUser.Password);

                user.Username = updatedUser.Username;
                user.Role = updatedUser.Role;
                user.IsActive = updatedUser.IsActive;

                _context.Users.Update(updatedUser);
                await _context.SaveChangesAsync();

                result.Message = "Successfully Updated";
                result.Success = true;
                return result;
            }
            catch (Exception exp)
            {
                if (exp.Message == new NullReferenceException().Message)
                {
                    result.Message = "User not found!";
                }

                _logError.Error(exp);
                result.Message = exp.Message;
                result.Success = false;

                return result;
            }
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePassword newPassword)
        {
            var userId = Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type.Equals("user_id"))?.Value);
            var user = await _context.Users.FindAsync(userId);
            (user.Salt, user.Hash) = PasswordManager.HashPassword(newPassword.Password);

            _context.Update(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("ChangeProfilePic/{id}")]
        public async Task<IActionResult> ChangeProfilePic(int id, IFormFile photo)
        {
            var user = await _context.Users.Where(e => e.Id == id)
                .FirstOrDefaultAsync();

            if (user == null || photo == null)
                return BadRequest();

            try
            {
                var filename = await FileManager.UploadImage(Path.Combine(_env.WebRootPath, _folder), photo);
                if (filename != null)
                {
                    if (user.Photo != null)
                    {
                        FileManager.DeleteFile(Path.Combine(_env.WebRootPath, _folder, user.Photo));
                    }
                    user.Photo = _folder + "/" + filename;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception exp)
            {
                _logError.Error(exp);
                return StatusCode(500);
            }
        }

        private User Validate(UserLogin user)
        {
            User loggedInUser = new User();
            var item = _context.Users
                    .Where(u => u.Username == user.Username && u.IsActive == true)
                    .SingleOrDefault();

            if (item != null)
            {
                if (PasswordManager.VerifyPassword(user.Password, item.Salt, item.Hash))
                {
                    loggedInUser = item;
                }
            }

            return loggedInUser;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate(UserLogin user)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var _user = Validate(user);
                    if (_user.Username == null)
                    {
                        return Unauthorized();
                    }

                    var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _user.Username),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("user_id", _user.Id.ToString())
                };

                    claims.Add(new Claim(ClaimTypes.Role, _user.Role));

                    var token = new JwtSecurityToken
                    (
                        issuer: _authConfiguration.Issuer,
                        audience: _authConfiguration.Audience,
                        claims: claims,
                        expires: DateTime.UtcNow.AddDays(60),
                        notBefore: DateTime.UtcNow,
                        signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authConfiguration.SigningKey)),
                                SecurityAlgorithms.HmacSha256)
                    );

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        user_id = _user.Id,
                        username = _user.Username,
                        name = _user.Name,
                        role = _user.Role,
                        permissions = _user.Permissions,
                        photo = _user.Photo
                    });
                }
                catch (Exception exp)
                {
                    _logError.Error(exp);
                    return Content(exp.Message);
                }
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                _context.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new Result { Message = "Successfully deleted" });
            }
            catch (Exception exp)
            {
                return Content(exp.Message);
            }
        }
    }
}
