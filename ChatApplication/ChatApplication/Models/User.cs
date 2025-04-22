using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApplication.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Hash { get; set; }
        [Required]
        public string Salt { get; set; }
        public string Permissions { get; set; }
        public string Attachment { get; set; }
        public bool? IsActive { get; set; }
        public string Role { get; set; }
        public string Photo { get; set; }
        public DateTime? DOB { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }

        [NotMapped]
        public string Password { get; set; }
    }
}
