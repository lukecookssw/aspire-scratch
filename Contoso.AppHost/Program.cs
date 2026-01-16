
using Contoso.Infrastructure.Data;
using Azure.Provisioning.AppService;
var builder = DistributedApplication.CreateBuilder(args);


// SQL Server: Container locally, Azure SQL in production
var password = builder.AddParameter("password", secret: true, value: "Password1!");

var sqlServer = builder.AddAzureSqlServer("azure-sql-server")
                       .RunAsContainer(container =>
                       {
                          container.WithLifetime(ContainerLifetime.Persistent);
                          container.WithHostPort(1433);
                          container.WithPassword(password);
                       });

var db = sqlServer.AddDatabase(DatabaseMetadata.ContosoDatabase);


var appServiceEnv = builder.AddAzureAppServiceEnvironment("app-service-env")
.ConfigureInfrastructure(infra =>
{
   var plan = infra.GetProvisionableResources()
      .OfType<AppServicePlan>()
      .Single();

   plan.Kind = "app,linux";
   plan.IsAsyncScalingEnabled = false;
   plan.IsElasticScaleEnabled = false;

   plan.Sku = new AppServiceSkuDescription
   {
      Name = "B1",
      Capacity = 2
   };
});

var migrationService = builder.AddProject<Projects.Contoso_MigrationService>("migration-service")
                              .WithReference(db)
                              .WaitFor(db)
                              .PublishAsAzureAppServiceWebsite((infra, site) =>
                              {
                                 site.SiteConfig.IsAlwaysOn = true;
                                 site.SiteConfig.NumberOfWorkers = 1;

                                 var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                                 var envSetting = new AppServiceNameValuePair
                                 {
                                    Name = "ASPNETCORE_ENVIRONMENT",
                                    Value = env ?? "Development"
                                 };
                                 site.SiteConfig.AppSettings.Add(new Azure.Provisioning.BicepValue<AppServiceNameValuePair>(envSetting));
                              });

var webapi = builder.AddProject<Projects.Contoso_WebApi>("api")
                    .WithReference(db)
                    .WaitFor(migrationService)
                    .WithExternalHttpEndpoints()
                    .PublishAsAzureAppServiceWebsite((infra, site) =>
                    {
                       site.SiteConfig.NumberOfWorkers = 1;
                    });

if (builder.ExecutionContext.IsPublishMode)
{
   var logAnalytics = builder.AddAzureLogAnalyticsWorkspace("log-analytics");
   var insights = builder.AddAzureApplicationInsights("insights", logAnalytics);
   webapi.WithReference(insights);
   migrationService.WithReference(insights);
}


var frontend = builder.AddJavaScriptApp("frontend", "../vue-ui")
                      .WithHttpEndpoint(port: 5173, env: "PORT", isProxied: false)
                      .WithReference(webapi)
                      .WaitFor(webapi);


builder.Build().Run();