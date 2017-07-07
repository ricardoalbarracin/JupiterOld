using System;
using Infrastructure.Logging;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebLayer.Fliters
{
	public class GlobalExceptionFilter : IExceptionFilter
	{
		private readonly ILoggerAdapter _logger;

		public GlobalExceptionFilter(ILoggerAdapter logger)
		{
            _logger = logger;
		}

        public void OnException(ExceptionContext context)
		{
            this._logger.LogError("GlobalExceptionFilter", context.Exception);
		}
	}
}
