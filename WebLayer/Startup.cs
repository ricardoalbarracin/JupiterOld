using System;
using ApplicationCore.Utils.Interfaces;
using ApplicationCore.Seg.BL;
using ApplicationCore.Seg.Interfaces;
using Infrastructure;using Infrastructure.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog.Config;
using NLog.Extensions.Logging;
using NLog.Web;
using WebLayer.Fliters;
using WebLayer.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace WebLayer
{
	
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            var policy = new AuthorizationPolicyBuilder()
                     .RequireAuthenticatedUser()
                .Build();
			services.AddMvc(options =>
			{
                options.Filters.Add(typeof(FilterAllActions));
                options.Filters.Add(typeof(GlobalExceptionFilter));
				options.Filters.Add(new AuthorizeFilter(policy));
			});
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddSingleton(provider => Configuration);
            services.AddScoped<IAccountBL, AccountBL>();
            services.AddScoped<ILoggerAdapter, LoggerAdapter>();
            services.AddScoped<IDapperAdapter, DapperAdapter>();

			// Adds a default in-memory implementation of IDistributedCache.
			services.AddDistributedMemoryCache();
			
            services.AddSession(options =>
			{
                options.IdleTimeout = TimeSpan.FromDays(1);
			});

			
		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
           
            app.UseSession();
			
            ConfigurationItemFactory.Default.LayoutRenderers.RegisterDefinition("trace-id", typeof(Infrastructure.Logging.AspNetTraceIdLayoutRenderer));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

			app.UseTraceIdMiddleware();
			app.UseSessionIdMiddleware();

			app.UseCookieAuthentication(new CookieAuthenticationOptions()
			{
				AuthenticationScheme = "JupiterCookieAuthenticationScheme",
				LoginPath = new PathString("/Account/Login/"),
				AccessDeniedPath = new PathString("/Account/Forbidden/"),
				AutomaticAuthenticate = true,
				AutomaticChallenge = true
			});

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
			app.AddNLogWeb();
			loggerFactory.AddNLog();

        }
    }
}
