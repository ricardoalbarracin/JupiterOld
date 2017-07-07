using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace WebLayer.Middleware
{
    public class TraceIdMiddleware
    {
		private readonly RequestDelegate _next;
		public TraceIdMiddleware(RequestDelegate next)
		{
			_next = next;
		}

		public async Task Invoke(HttpContext context)
		{
            var TraceId = context.TraceIdentifier;
            context.Response.Headers.Add("TraceId", TraceId);
            await _next.Invoke(context);
		}
    }

	public static class TraceIdMiddlewareAppBuilderExtensions
	{
		public static IApplicationBuilder UseTraceIdMiddleware(this IApplicationBuilder app)
		{
			return app.UseMiddleware<TraceIdMiddleware>();
		}
	}
}
