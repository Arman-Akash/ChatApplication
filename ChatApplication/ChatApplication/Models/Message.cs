using Microsoft.AspNetCore.Identity;

namespace ChatApplication.Models
{
    public class Message
    {
        public int Id { get; set; }
        public IdentityUser IdentityUser { get; set; }
    }
}
