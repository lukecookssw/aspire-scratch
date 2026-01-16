
using Contoso.Application.Service;

namespace Contoso.WebApi.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {

        app.MapGet("/user/{id}", (int id, IUserService userService, CancellationToken ct) =>
        {
            return userService.GetUserById(id, ct);
        })
        .WithName("GetUserById");
    }
}

