using System.Net;

namespace ChatApplication.Utility
{
    public class Result
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; }
        public HttpStatusCode? StatusCode { get; set; }
    }

    public class Result<T> : Result
    {
        public T Data { get; set; }
    }

    public class ListResult : Result
    {
        public int Count { get; set; }
    }

    public class ListResult<T> : ListResult
    {
        public IEnumerable<T> Data { get; set; }
    }

    public class Pagination<T> : ListResult<T>
    {
        public PageConfig Pageconfig { get; set; }
    }
}
