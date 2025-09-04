using SportsShare.Api.Models;

namespace SportsShare.Api.Services
{
    public class UserService
    {
        private readonly List<User> _users = new List<User>();
        private int _nextId = 1;

    public UserService()
    {
        SeedUsers(); 
    }

        public IEnumerable<User> GetAll() => _users;

        public User? GetById(int id) => _users.FirstOrDefault(u => u.Id == id);

        public User Add(User user)
        {
            user.Id = _nextId++;

            // Give a random location (for demo purposes)
            var rnd = new Random();
            user.CurrentLocation = new Location
            {
                Latitude = 32.0 + rnd.NextDouble(),
                Longitude = 34.8 + rnd.NextDouble()
            };

            user.Friends = new List<User>();

            _users.Add(user);
            return user;
        }

        public User? Authenticate(string username, string password)
        {
            return _users.FirstOrDefault(u => u.Username == username && u.Password == password);
        }

        public bool UsernameExists(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return false;

            // Trim and compare in lowercase
            var normalized = username.Trim().ToLower();
            return _users.Any(u => u.Username?.Trim().ToLower() == normalized);
        }

        public void AddFriend(int userId, int friendId)
        {
            var user = _users.FirstOrDefault(u => u.Id == userId);
            var friend = _users.FirstOrDefault(u => u.Id == friendId);

            if (user != null && friend != null && !user.Friends.Contains(friend))
            {
                user.Friends.Add(friend);
            }
            if (friend != null && user != null && !friend.Friends.Contains(user))
            {
                friend.Friends.Add(user); // ensure mutual friendship
            }
        }

        private void SeedUsers()
        {
            // Example users
            var userA = Add(new User { Username = "a", Password = "1", DateOfBirth = new DateTime(1990, 1, 1), Weight = 70, Address = "Jerusalem" });
            var userB = Add(new User { Username = "b", Password = "2", DateOfBirth = new DateTime(1990, 2, 2), Weight = 80, Address = "Tel Aviv" });
            var userC = Add(new User { Username = "c", Password = "3", DateOfBirth = new DateTime(1990, 3, 3), Weight = 65, Address = "Haifa" });
            var userD = Add(new User { Username = "d", Password = "4", DateOfBirth = new DateTime(1990, 4, 4), Weight = 75, Address = "Beer Sheva" });
            var userE = Add(new User { Username = "e", Password = "5", DateOfBirth = new DateTime(1990, 5, 5), Weight = 68, Address = "Eilat" });
            var userF = Add(new User { Username = "f", Password = "6", DateOfBirth = new DateTime(1990, 6, 6), Weight = 82, Address = "Netanya" });

            // Define friends (mutual friendships)
            // AddFriend(userA.Id, userB.Id);
        }
    }
}
