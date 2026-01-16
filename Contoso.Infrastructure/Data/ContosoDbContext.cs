using Microsoft.EntityFrameworkCore;
using Contoso.Infrastructure.Data.Entities;

namespace Contoso.Infrastructure.Data;

public interface IContosoDbContext
{
    DbSet<User> Users { get; }
}

public class ContosoDbContext : DbContext, IContosoDbContext
{
    public ContosoDbContext(DbContextOptions<ContosoDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}