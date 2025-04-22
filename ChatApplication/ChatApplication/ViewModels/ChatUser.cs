using System.ComponentModel.DataAnnotations;

namespace ChatApplication.ViewModels
{
    public class ChatUser
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Username { get; set; }
        public string Photo { get; set; }
    }
}
