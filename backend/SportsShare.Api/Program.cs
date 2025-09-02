using SportsShare.Api.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddSingleton<UserService>();
builder.Services.AddControllers();

// ✅ Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SportsShare API", Version = "v1" });
});

// ✅ Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:4200") // Angular app
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// ✅ Enable CORS
app.UseCors("AllowFrontend");

// ✅ Swagger always available
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SportsShare API v1");
    c.RoutePrefix = string.Empty; // makes swagger available at http://localhost:5202/
});

// app.UseHttpsRedirection();

app.MapGet("/", () => "SportsShare API running");

// ✅ Map controller endpoints
app.MapControllers();

app.Run();
