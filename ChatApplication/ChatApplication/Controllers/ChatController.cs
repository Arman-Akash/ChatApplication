using ChatApplication.Data;
using ChatApplication.Hubs;
using ChatApplication.Hubs.Clients;
using ChatApplication.Models;
using ChatApplication.Utility;
using ChatApplication.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly ILogError _logError;
        private readonly IHubContext<ChatHub, IChatClient> _chatHub;

        public ChatController(ChatDbContext context, ILogError logError,
            IHubContext<ChatHub, IChatClient> _chatHub)
        {
            _context = context;
            _logError = logError;
            this._chatHub = _chatHub;
        }

        [HttpGet("GetUsers")]
        public async Task<ListResult<ChatUser>> GetUsers()
        {
            var result = new ListResult<ChatUser>
            {
                Data = (await _context.Users
                    .Where(e => e.IsActive == true)
                    .Where(e => e.Id != User.GetUserId())
                    .ToListAsync())
                    .Select(e => new ChatUser
                    {
                        Id = e.Id,
                        Username = e.Username,
                        Name = e.Name,
                        Photo = e.Photo
                    })
            };

            return result;
        }

        //[HttpGet("GetMessages/{userId}")]
        //public async Task<ListResult<Message>> GetMessages(int userId)
        //{
        //    var ownId = User.GetUserId();
        //    var result = new ListResult<Message>();
        //    result.Data = await _messageRepository
        //            .Get(e => (e.SenderId == userId && e.ReceiverId == ownId)
        //                || (e.ReceiverId == userId && e.SenderId == ownId))
        //            .OrderByDescending(e => e.Id)
        //            .Take(10)
        //            .OrderBy(e => e.Id)
        //            .ToListAsync();

        //    return result;
        //}

        [HttpGet("GetMessages/{userId}/{pageNumber}")]
        public async Task<ListResult<Message>> GetMessages(int userId, int pageNumber)
        {
            int pageSize = 10;
            var ownId = User.GetUserId();
            var result = new ListResult<Message>();
            result.Data = await _context.Messages
                    .Where(e => (e.SenderId == userId && e.ReceiverId == ownId)
                        || (e.ReceiverId == userId && e.SenderId == ownId))
                    .OrderByDescending(e => e.Id)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .OrderBy(e => e.Id)
                    .ToListAsync();

            return result;
        }

        [HttpPost]
        public async Task<Result> Post(ChatMessage message)
        {
            var result = new Result();
            try
            {
                var msg = new Message();
                msg.SenderId = User.GetUserId();
                msg.ReceiverId = message.Receiver;
                msg.Content = message.Message;
                msg.DateTime = DateTime.Now;
                _context.Messages.Add(msg);
                await _context.SaveChangesAsync();


                await _chatHub.Clients.Group(message.Receiver.ToString()).ReceiveMessage(message);
                //await _chatHub.Clients.All.ReceiveMessage(message);
                result.Success = true;
            }
            catch (Exception exp)
            {
                _logError.Error(exp);
                result.Success = false;
            }
            return result;
        }
    }
}
