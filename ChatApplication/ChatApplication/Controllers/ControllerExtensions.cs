using System.Security.Claims;

namespace ChatApplication.Controllers
{
    public static class ControllerExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return Convert.ToInt32(user.Claims.FirstOrDefault(x => x.Type.Equals("user_id"))?.Value);
        }
    }
}
