
using Contoso.Application.Service;
using Microsoft.Extensions.DependencyInjection;

namespace Contoso.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        return services;
    }
}
