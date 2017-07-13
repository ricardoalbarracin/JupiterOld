﻿using System;
using System.Runtime.CompilerServices;

namespace ApplicationCore.Utils.Interfaces
{
    /// <summary>
    /// Interfaz que define el comportamiento para el servicio de loggs.
    /// </summary>
    public interface ILoggerAdapter
    {
        /// <summary>
        /// Logs the trace.
        /// </summary>
        /// <param name="message">Message.</param>
        /// <param name="inputParameters">Input parameters.</param>
        /// <param name="outputParameters">Output parameters.</param>
        void LogTrace(string message, dynamic inputParameters = null, dynamic outputParameters = null);

        /// <summary>
        /// Logs the error.
        /// </summary>
        /// <param name="message">Message.</param>
        /// <param name="ex">Ex.</param>
        void LogError(string message, Exception ex);
	}
}
