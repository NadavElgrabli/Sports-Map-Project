using SportsShare.Api.Models;

namespace SportsShare.Api.Services
{
    public class UserService
    {
        private readonly List<User> _users = new List<User>();
        private int _nextId = 1;

        public IEnumerable<User> GetAll() => _users;

        public User? GetById(int id) => _users.FirstOrDefault(u => u.Id == id);

        public User Add(User user)
        {
            user.Id = _nextId++;
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

    }
}
