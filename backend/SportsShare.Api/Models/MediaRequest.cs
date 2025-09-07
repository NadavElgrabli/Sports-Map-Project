namespace SportsShare.Api.Models
{
    public class MediaRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Url { get; set; } = string.Empty;
        public string Type { get; set; } = "image"; // or "video"
    }
}
