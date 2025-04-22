using ChatApplication.ViewModels;
using System.Threading.Tasks;

namespace ChatApplication.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
    }
}
