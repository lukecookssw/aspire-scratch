
using Contoso.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Contoso.Infrastructure;



public static class DependencyInjection
{
    public static void AddInfrastructure(this IHostApplicationBuilder builder)
    {
        
        builder.AddSqlServerDbContext<ContosoDbContext>(DatabaseMetadata.ContosoDatabase,
            null,
            options =>
            {
            });

        builder.Services.AddScoped<IContosoDbContext>(provider => provider.GetRequiredService<ContosoDbContext>());
    }
}