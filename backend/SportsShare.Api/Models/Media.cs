namespace SportsShare.Api.Models
{
    public class Media
    {
        public string Url { get; set; } = string.Empty; // For now, we can store file URL/path
        public string Type { get; set; } = "image"; // "image" or "video"
    }
}
