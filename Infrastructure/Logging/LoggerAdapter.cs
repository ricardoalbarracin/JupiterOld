using System;
using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using NLog;

namespace Infrastructure.Logging
{


    public class LoggerAdapter : ILoggerAdapter
    {
        Logger _logger;
        IHttpContextAccessor _IHttpContextAccessor; 
        public LoggerAdapter(IHttpContextAccessor httpContextAccessor)
        {
            _IHttpContextAccessor = httpContextAccessor;
            _logger = LogManager.GetCurrentClassLogger();
        }

        public void LogTrace(string message, dynamic inputParameters = null, dynamic outputParameters = null)
        {
            var logEvent = new LogEventInfo();
            logEvent.Message = message;
            logEvent.Level = LogLevel.Trace;
            var target = Environment.StackTrace.Split('\n')[3].Trim();
            logEvent.Properties["Target"] =   target;
			logEvent.Properties["InputArguments"] = GetSerilizeArguments(inputParameters);
			logEvent.Properties["OutputArguments"] = GetSerilizeArguments(outputParameters);
            logEvent.Properties["SessionId"] = _IHttpContextAccessor.HttpContext.Session.Id;
            _logger.Trace(logEvent);
        }

        public void LogError(string message, Exception ex)
        {
            var logEvent = new LogEventInfo();
            logEvent.Message = message;
            logEvent.Level = LogLevel.Error;
            logEvent.Message = ex.Message;
            logEvent.Exception = ex;
            var target = ex.StackTrace.Split('\n')[0];
            logEvent.Properties["Target"] = target;
            logEvent.Properties["SessionId"] = _IHttpContextAccessor.HttpContext.Session.Id;
            _logger.Error(ex, message);
        }

        /// <summary>
        /// Metodo que retorna los argumentos en formato json, validando su tamaño previamente para evitar conflictos con el sistema de logs
        /// </summary>
        /// <param name="data">argumentos</param>
        /// <returns></returns>
        private  string GetSerilizeArguments(dynamic data)
		{
			if (data == null)
			{
				return string.Empty;
			}
             
			var dataJson = JsonConvert.SerializeObject(data);
			// Limite 30Kb aprox
			if (Encoding.UTF8.GetBytes(dataJson).LongLength > 45822)
			{
				return "El objecto excede el tamaño permitido para transferir en un registro de log";
			}

			return dataJson;
		}
    }
}