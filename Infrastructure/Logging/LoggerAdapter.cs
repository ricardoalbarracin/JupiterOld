using System;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Logging
{

    public interface IAppLogger<T>
    {
        void LogWarning(string message, params object[] args);
    }

    public class LoggerAdaptersss<T> : IAppLogger<T>
    {
        private readonly ILogger<T> _logger;
        public LoggerAdaptersss(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<T>();
        }
        public void LogWarning(string message, params object[] args)
        {
            _logger.LogWarning(message, args);
        }
    }

}
