using System;
using System.Collections.Generic;
using System.Text;

namespace ChatApplication.ViewModels
{
    public class ChatMessage
    {
        public int User { get; set; }

        public string Message { get; set; }
        public int Receiver { get; set; }
    }
}
