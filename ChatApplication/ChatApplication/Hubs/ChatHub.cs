using ChatApplication.Hubs.Clients;
using ChatApplication.Utility;
using Microsoft.AspNetCore.SignalR;

namespace ChatApplication.Hubs
{
    //[Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        //private readonly IRepository<Message> _repository;
        private readonly ILogError _logError;
        public ChatHub(ILogError _logError)
        {
            //this._repository = _repository;
            this._logError = _logError;
        }

        //public override Task OnConnectedAsync()
        //{
        //    Groups.AddToGroupAsync(Context.ConnectionId, Context.User.Identity.Name);
        //    return base.OnConnectedAsync();
        //}

        //public async Task SendMessage(ChatMessage message)
        //{
        //    try
        //    {
        //        var msg = new Message();
        //        msg.SenderId = Context.User.GetUserId();
        //        msg.ReceiverId = Convert.ToInt32(message.Receiver);
        //        msg.Content = message.Message;
        //        await _repository.InsertAsync(msg);
        //    }
        //    catch(Exception exp)
        //    {
        //        _logError.Error(exp);
        //    }
        //    await Clients.All.ReceiveMessage(message);
        //    //await Clients.User("6").ReceiveMessage(message);
        //}

        //public async Task SendMessage(string user, string message)
        //{
        //    await Clients.All.SendAsync("ReceiveMessage", user, message);
        //}

        //public Task SendMessageToGroup(ChatMessage message)
        //{
        //    return Clients.Group(message.Receiver).ReceiveMessage(message);
        //}
        public Task JoinGroup(string groupName)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
