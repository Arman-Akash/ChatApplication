using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApplication.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public User Sender { get; set; }
        public int ReceiverId { get; set; }
        public User Receiver { get; set; }
        public DateTime Created { get; set; }
        public bool Seen { get; set; }
        public string Content { get; set; }
        public DateTime DateTime { get; set; }

        [NotMapped]
        public string Date
        {
            get { return DateTime.ToString("MM/dd/yyyy"); }
        }

        [NotMapped]
        public string Time
        {
            get { return DateTime.ToString("hh:mm tt"); }
        }

    }
}
