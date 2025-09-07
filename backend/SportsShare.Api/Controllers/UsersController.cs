using Microsoft.AspNetCore.Mvc;
using SportsShare.Api.Models;
using SportsShare.Api.Services;

namespace SportsShare.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] User user)
        {
            if (user.DateOfBirth.Month % 2 == 0)
                return BadRequest("Cannot signup users born in even months.");

            // Check for null or empty username
            if (string.IsNullOrWhiteSpace(user.Username))
                return BadRequest("Username is required.");

            // Trim username before checking existence
            user.Username = user.Username.Trim();

            if (_userService.UsernameExists(user.Username))
                return BadRequest("Username already exists.");

            var addedUser = _userService.Add(user);
            return Ok(addedUser);
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Username and password are required");

            var authUser = _userService.Authenticate(request.Username, request.Password);
            if (authUser == null) 
                return Unauthorized("Invalid username or password");

            var response = new
            {
                expiresIn = 300,                
                user = authUser
            };

            return Ok(response);
        }


        [HttpGet] 
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }



        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userService.GetById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("{id}/friends")]
        public IActionResult GetFriends(int id)
        {
            var user = _userService.GetById(id);
            if (user == null) return NotFound();

            var friends = user.Friends
                .Select(fid => _userService.GetById(fid))
                .Where(f => f != null)
                .ToList();

            return Ok(friends);
        }

        // Get full trail of a user
        [HttpGet("{id}/trail")]
        public IActionResult GetTrail(int id)
        {
            var user = _userService.GetById(id);
            if (user == null) return NotFound();

            return Ok(user.Trail);
        }

        // Add media to a specific trail point
        [HttpPost("{id}/trail/media")]
        public IActionResult AddMediaToTrail(int id, [FromBody] MediaRequest request)
        {
            var user = _userService.GetById(id);
            if (user == null) return NotFound();

            // Find closest trail point to requested location (or exact match)
            var closest = user.Trail.OrderBy(t => 
                Math.Pow(t.Location.Latitude - request.Latitude, 2) +
                Math.Pow(t.Location.Longitude - request.Longitude, 2)
            ).FirstOrDefault();

            if (closest == null) return BadRequest("No trail point found near this location.");

            closest.Media.Add(new Models.Media { Url = request.Url, Type = request.Type });

            return Ok(closest);
        }
    }
}
