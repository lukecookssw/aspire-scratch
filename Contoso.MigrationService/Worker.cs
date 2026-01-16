using Contoso.Infrastructure.Data;
using Contoso.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Contoso.MigrationService;

public class Worker(
    IServiceProvider serviceProvider,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    protected override async Task ExecuteAsync(
        CancellationToken cancellationToken)
    {
        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ContosoDbContext>();

            await RunMigrationAsync(dbContext, cancellationToken);
            await SeedDataAsync(dbContext, cancellationToken);
        }
        catch (Exception)
        {
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task RunMigrationAsync(
        ContosoDbContext dbContext, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(
            async () => await dbContext.Database.MigrateAsync(cancellationToken)
            );
    }

    private static async Task SeedDataAsync(
        ContosoDbContext dbContext, CancellationToken cancellationToken)
    {
        User user = new User
        {
            Username = "admin",
            Email = "admin@local"
        };
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
