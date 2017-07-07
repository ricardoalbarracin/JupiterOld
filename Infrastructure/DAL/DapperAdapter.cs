﻿﻿using System;
using System.Data;
using Dapper;
using Npgsql;
using Microsoft.Extensions.Configuration;
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
