using System.ComponentModel.DataAnnotations;

namespace ChatApplication.ViewModels
{
    public class ChangePassword
    {
        [Required]
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
