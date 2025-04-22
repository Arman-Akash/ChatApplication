using System.ComponentModel.DataAnnotations;

namespace ChatApplication.ViewModels
{
    public class UserRegistration
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public DateTime DOB { get; set; }
    }
}
