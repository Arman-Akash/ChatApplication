namespace ChatApplication.Utility
{
    public static class FileManager
    {
        private static readonly string[] _allowedDocTypes = new string[] { "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream", "application/msword",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", "video/3gpp", "video/mp4", "audio/mpeg", "video/webm",
        "video/x-matroska", "video/x-flv", "video/x-ms-wmv", "video/quicktime", "video/x-msvideo"};
        private static readonly string[] _allowedImageTypes = new string[] { "image/jpeg", "image/png" };

        public async static Task<string> UploadImage(string folder, IFormFile file)
        {
            string fileName = null;

            if (file != null)
            {
                if (file.Length > 0 && file.IsVerified(_allowedImageTypes))
                {
                    fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    string absoluteFilePath = Path.Combine(folder, fileName);
                    using (var stream = new FileStream(absoluteFilePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    //using (Image image = Image.FromStream(file.OpenReadStream()))
                    //{
                    //    //compress the image size and save
                    //    int _size = image.Width < 1080 ? image.Width : 1080;
                    //    try
                    //    {
                    //        image.Resize(_size).Save(absoluteFilePath, image.RawFormat);
                    //    }
                    //    catch (Exception exp)
                    //    {
                    //        throw exp;
                    //        //new LogError().Error(exp);
                    //    }
                    //}
                }
            }

            return fileName;
        }

        public static async Task<string> UploadFile(string folder, IFormFile file)
        {
            string fileName = "";

            if (file.Length > 0 && (file.IsVerified(_allowedDocTypes) || file.IsVerified(_allowedImageTypes)))
            {
                fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string absoluteFilePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(absoluteFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            else
                return string.Empty;

            return fileName;
        }

        public static async Task<string> UploadVideo(string folder, IFormFile video)
        {
            string fileName = "";

            if (video.Length > 0)
            {
                fileName = $"{Guid.NewGuid()}{Path.GetExtension(video.FileName)}";
                string absoluteFilePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(absoluteFilePath, FileMode.Create))
                {
                    await video.CopyToAsync(stream);
                }
            }

            return fileName;
        }

        public static void DeleteFile(params string[] files)
        {
            foreach (var absoluteFilePath in files)
            {
                if (File.Exists(absoluteFilePath))
                {
                    try
                    {
                        File.Delete(absoluteFilePath);
                    }
                    catch (IOException)
                    {
                        continue;
                    }
                }
            }
        }

        public static async Task<Stream> DownloadFile(string filePath)
        {
            try
            {
                byte[] result;

                using (FileStream SourceStream = File.Open(filePath, FileMode.Open))
                {
                    result = new byte[SourceStream.Length];
                    await SourceStream.ReadAsync(result, 0, (int)SourceStream.Length);
                }

                Stream stream = new MemoryStream(result);

                return stream;
            }
            catch (Exception)
            {
                return null;
            }
        }

        private static bool IsVerified(this IFormFile file, string[] allowedTypes)
        {
            if (allowedTypes.Contains(file.ContentType))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
