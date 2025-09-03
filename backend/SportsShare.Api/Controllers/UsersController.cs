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

            if (_userService.UsernameExists(user.Username))
                return BadRequest("Username already exists.");

            // Trim username before saving
            user.Username = user.Username?.Trim();

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
                expiresIn = 10,                // expires in 10 seconds for testing purposes
                user = authUser
            };

            return Ok(response);
        }


        [HttpGet("users")]
        public IActionResult GetAll()
        {
            return Ok(_userService.GetAll());
        }
    }
}
