using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace WebLayer.Middleware
{
    public class SessionIdMiddleware
    {
		private readonly RequestDelegate _next;
		public SessionIdMiddleware(RequestDelegate next)
		{
			_next = next;
		}

		public async Task Invoke(HttpContext context)
		{
            //var SessionId = context.Session.Id;

            //context.Response.Headers.Add("SessionId", SessionId);
            await _next.Invoke(context);
		}
    }

	public static class SessionIdMiddlewareAppBuilderExtensions
	{
		public static IApplicationBuilder UseSessionIdMiddleware(this IApplicationBuilder app)
		{
			return app.UseMiddleware<SessionIdMiddleware>();
		}
	}
}
