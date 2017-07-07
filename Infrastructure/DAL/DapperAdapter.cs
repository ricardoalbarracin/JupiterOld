﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using System.Linq;
using Npgsql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NLog;
//using Infrastructure.Logging;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using ApplicationCore.Gen.Models;
using Infrastructure.Logging;
using Infrastructure.DAL;

namespace Infrastructure
{
    

    public class DapperAdapter:IDapperAdapter
    {
        private string _connectionString;
        IHttpContextAccessor _httpContextAccessor;
        public ILoggerAdapter _logger;
       
        public DapperAdapter(IConfigurationRoot configuration,
                          IHttpContextAccessor httpContextAccessor,ILoggerAdapter logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }



		public  Transaction Query<T>(string sql, object param = null,
										  IDbTransaction transaction = null)
		{

			Transaction trans = new Transaction();
            try
            {
                trans.Result = GetConnection().Query<T>(sql, param, transaction, true);
                trans.State = TransState.success;
                _logger.LogTrace(sql, param, trans.Result);

            }
			catch (Exception ex)
			{
				trans.Message = ex.ToString();
			}
			return trans;
		}

        public IDbConnection GetConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}
