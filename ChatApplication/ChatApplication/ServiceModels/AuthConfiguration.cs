namespace ChatApplication.ServiceModels
{
    public class AuthConfiguration
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string SigningKey { get; set; }
    }
}
