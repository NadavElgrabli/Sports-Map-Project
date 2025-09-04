using SportsShare.Api.Models;
using System.Timers;

namespace SportsShare.Api.Services
{
    public class UserService
    {
        private readonly List<User> _users = new List<User>();
        private int _nextId = 1;
        private readonly Random _rnd = new Random();
        private readonly System.Timers.Timer _movementTimer; // fully qualified

        public UserService()
        {
            SeedUsers();

            // Set up a timer to move users every 5 seconds
            _movementTimer = new System.Timers.Timer(5000); // 5000 ms = 5 sec
            _movementTimer.Elapsed += (sender, e) => MoveUsers();
            _movementTimer.AutoReset = true;
            _movementTimer.Enabled = true;
        }

        public IEnumerable<User> GetAll() => _users;

        public User? GetById(int id) => _users.FirstOrDefault(u => u.Id == id);

        public User Add(User user)
        {
            user.Id = _nextId++;

            // Tel Aviv coordinates
            double baseLat = 32.07;
            double baseLng = 34.78;

            // Small random offset to cluster friends closer together
            double offsetLat = _rnd.NextDouble() * 0.05;
            double offsetLng = _rnd.NextDouble() * 0.05;

            user.CurrentLocation = new Location
            {
                Latitude = baseLat + offsetLat,
                Longitude = baseLng + offsetLng
            };

            user.Friends = new List<int>();

            _users.Add(user);
            return user;
        }

        private void MoveUsers()
        {
            foreach (var user in _users)
            {
                // Max ~30 meters in latitude/longitude degrees
                double maxDelta = 0.00027; // ~30m in degrees

                user.CurrentLocation.Latitude += (_rnd.NextDouble() * 2 - 1) * maxDelta;
                user.CurrentLocation.Longitude += (_rnd.NextDouble() * 2 - 1) * maxDelta;
            }
        }

        public User? Authenticate(string username, string password)
        {
            return _users.FirstOrDefault(u => u.Username == username && u.Password == password);
        }

        public bool UsernameExists(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return false;

            var normalized = username.Trim().ToLower();
            return _users.Any(u => u.Username?.Trim().ToLower() == normalized);
        }

        public void AddFriend(int userId, int friendId)
        {
            var user = _users.FirstOrDefault(u => u.Id == userId);
            var friend = _users.FirstOrDefault(u => u.Id == friendId);

            if (user != null && friend != null)
            {
                if (!user.Friends.Contains(friend.Id))
                    user.Friends.Add(friend.Id);

                if (!friend.Friends.Contains(user.Id))
                    friend.Friends.Add(user.Id); 
            }
        }

        private void SeedUsers()
        {
            var userA = Add(new User { Username = "a", Password = "1", DateOfBirth = new DateTime(1990, 1, 1), Weight = 70, Address = "Jerusalem" });
            var userB = Add(new User { Username = "b", Password = "2", DateOfBirth = new DateTime(1990, 2, 2), Weight = 80, Address = "Tel Aviv" });
            var userC = Add(new User { Username = "c", Password = "3", DateOfBirth = new DateTime(1990, 3, 3), Weight = 65, Address = "Haifa" });
            var userD = Add(new User { Username = "d", Password = "4", DateOfBirth = new DateTime(1991, 4, 4), Weight = 75, Address = "Beer Sheva" });
            var userE = Add(new User { Username = "e", Password = "5", DateOfBirth = new DateTime(1992, 5, 5), Weight = 68, Address = "Eilat" });
            var userF = Add(new User { Username = "f", Password = "6", DateOfBirth = new DateTime(1993, 6, 6), Weight = 82, Address = "Netanya" });

            // Friendships
            AddFriend(userA.Id, userB.Id);
            AddFriend(userA.Id, userC.Id);
            AddFriend(userB.Id, userD.Id);
            AddFriend(userC.Id, userE.Id);
            AddFriend(userD.Id, userE.Id);
            AddFriend(userE.Id, userF.Id);
            AddFriend(userF.Id, userA.Id); 
        }
    }
}
