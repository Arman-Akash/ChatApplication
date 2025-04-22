using ChatApplication.Data;
using ChatApplication.Models;
using ChatApplication.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly ILogError _logError;
        private readonly IWebHostEnvironment _env;
        private readonly string _folder = "users";
        public UserController(ChatDbContext _context, ILogError logError,
            IWebHostEnvironment env)
        {
            this._context = _context;
            _logError = logError;
            _env = env;
        }

        [HttpGet]
        public async Task<ListResult<User>> Get()
        {
            var result = new ListResult<User>
            {
                Data = await _context.Users.Where(e => e.IsActive == true)
                .ToListAsync()
            };
            return result;
        }

        [HttpGet("Profile")]
        public async Task<Result<User>> Profile()
        {
            var result = new Result<User>
            {
                Data = await _context.Users.Where(e => e.Id == User.GetUserId()).FirstOrDefaultAsync()
            };
            return result;
        }

        [HttpPost("EditProfile")]
        public async Task<Result> EditProfile([FromForm] User user, IFormFile photo)
        {
            var result = new Result();
            if (user.Id != User.GetUserId())
            {
                result.Success = false;
                result.Message = "Bad Request";
                return result;
            }
            try
            {
                var profile = await _context.Users.FindAsync(user.Id);

                profile.DOB = user.DOB;
                profile.Name = user.Name;
                profile.Address = user.Address;
                profile.Phone = user.Phone;

                var filename = await FileManager.UploadImage(Path.Combine(_env.WebRootPath, _folder), photo);
                if (filename != null)
                {
                    if (profile.Photo != null)
                    {
                        FileManager.DeleteFile(Path.Combine(_env.WebRootPath, _folder, user.Photo));
                    }
                    profile.Photo = _folder + "/" + filename;
                }

                _context.Users.Update(profile);
                await _context.SaveChangesAsync();
                result.Message = "Succesfully Updated";
            }
            catch (Exception exp)
            {
                result.Success = false;
                _logError.Error(exp);
            }
            return result;
        }

        [HttpPost("Deactive/{id}")]
        public async Task<Result> Deactive(int id)
        {
            var result = new Result();
            try
            {
                var user = await _context.Users.FindAsync(id);
                user.IsActive = false;
                _context.Update(user);
                await _context.SaveChangesAsync();
                result.Success = true;
            }
            catch (Exception exp)
            {
                result.Success = false;
                _logError.Error(exp);
            }
            return result;
        }

        [HttpDelete("{id}")]
        public async Task<Result> Delete(int id)
        {
            var result = new Result();
            try
            {
                var user = await _context.Users.FindAsync(id);
                _context.Remove(user);
                await _context.SaveChangesAsync();
                result.Success = true;
            }
            catch (Exception exp)
            {
                result.Success = false;
                _logError.Error(exp);
            }
            return result;
        }
    }
}
