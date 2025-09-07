namespace SportsShare.Api.Models
{
    public class TrailPoint
    {
        public Location Location { get; set; } = new Location();
        public List<Media> Media { get; set; } = new List<Media>();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
