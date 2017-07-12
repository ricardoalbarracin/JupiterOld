﻿using System;
using System.Runtime.CompilerServices;

namespace ApplicationCore.Utils.Interfaces
{
    public interface ILoggerAdapter
    {
        void LogTrace(string message, dynamic inputParameters = null, dynamic outputParameters = null);
        void LogError(string message, Exception ex);
	}
}
