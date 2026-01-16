
namespace Contoso.WebApi;

public static class DependencyInjection
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services)
    {
        // Register Web API specific services here
        return services;
    }
}