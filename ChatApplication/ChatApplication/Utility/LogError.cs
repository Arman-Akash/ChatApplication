using System.Diagnostics;

namespace ChatApplication.Utility
{
    public interface ILogError
    {
        public void Error(Exception ex);
    }

    public class LogError : ILogError
    {
        private readonly IWebHostEnvironment _env;

        public LogError(IWebHostEnvironment env)
        {
            this._env = env;
        }

        public void Error(Exception ex)
        {
            var st = new StackTrace(ex, true);
            // Get the top stack frame
            var frame = st.GetFrame(0);
            // Get the line number from the stack frame
            var line = frame.GetFileLineNumber();
            var fileName = frame.GetFileName();

            var path = Path.Combine(_env.WebRootPath, "log.txt");
            StreamWriter sw = File.AppendText(path);
            var msg = DateTime.Now + "\n" + fileName + ":" + line + "\nMessage: " + ex.Message +
                "\nInner Exception: " + ex.InnerException + "\n";
            sw.WriteLine(msg);
            sw.Flush();
            sw.Close();
        }
    }
}
