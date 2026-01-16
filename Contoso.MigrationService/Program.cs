using Contoso.Infrastructure.Data;
using Contoso.MigrationService;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();

builder.AddSqlServerDbContext<ContosoDbContext>(DatabaseMetadata.ContosoDatabase);

var host = builder.Build();
host.Run();
