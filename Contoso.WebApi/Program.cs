

using Contoso.WebApi;
using Contoso.Application;
using Contoso.Infrastructure;
using Contoso.WebApi.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();


builder.Services.AddWebApiServices();
builder.Services.AddApplicationServices();
builder.AddInfrastructure();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors("AllowVueApp");
app.UseHttpsRedirection();

app.MapDefaultEndpoints();
app.MapWeatherEndpoints();
app.MapUserEndpoints();

app.Run();


