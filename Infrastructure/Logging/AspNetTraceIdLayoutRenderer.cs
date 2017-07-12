using System.Text;
using Microsoft.AspNetCore.Http;
using NLog;
using NLog.LayoutRenderers;
using NLog.Web.LayoutRenderers;

namespace Infrastructure.Logging
{


    /// <summary>
    /// ASP.NET Trace ID.
    /// </summary>
    [LayoutRenderer("trace-id")]
    public class AspNetTraceIdLayoutRenderer : AspNetLayoutRendererBase
    {
        /// <summary>
        /// Renders the ASP.NET Session ID appends it to the specified <see cref="StringBuilder" />.
        /// </summary>
        /// <param name="builder">The <see cref="StringBuilder"/> to append the rendered data to.</param>
        /// <param name="logEvent">Logging event.</param>
        protected override void DoAppend(StringBuilder builder, LogEventInfo logEvent)
        {
            var context = HttpContextAccessor.HttpContext;
            try
            {
                if (context.Session == null)
                {
                    return;
                }
            }
            catch
            {
                return;
            }
            builder.Append(context.TraceIdentifier);
        }

    }
}