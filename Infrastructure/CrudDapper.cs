using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using System.Linq;
using Npgsql;
using ApplicationCore.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NLog;

namespace Infrastructure
{
    public class CrudDapper

	{
		private string connectionString;
       
		public CrudDapper(IConfiguration configuration)
		{
            connectionString = configuration.GetConnectionString("DefaultConnection");
            //connectionString = @"Server=10.211.55.3;Port=5432;Database=postgres;Userid=postgres;Password=12345;Pooling=true;MinPoolSize=1;MaxPoolSize=20";
            Logger logger = LogManager.GetCurrentClassLogger();

            logger.Warn("hola mundo "+Guid.NewGuid());
		}

		public IDbConnection Connection
		{
			get
			{
				return new NpgsqlConnection(connectionString);
			}
		}

        public void Add(Customer prod)
		{
			using (IDbConnection dbConnection = Connection)
			{
				string sQuery = "INSERT INTO public.customer(firstname, lastname, email, createtime)"
								+ " VALUES(@Firstname, @Lastname, @Email, @Createtime)";
				dbConnection.Open();
				dbConnection.Execute(sQuery, prod);
			}
		}

		public IEnumerable<Customer> GetAll()
		{
			using (IDbConnection dbConnection = Connection)
			{
				dbConnection.Open();
				return dbConnection.Query<Customer>("SELECT * FROM Products");
			}
		}

		public Customer GetByID(int id)
		{
			using (IDbConnection dbConnection = Connection)
			{
				string sQuery = "SELECT * FROM Products"
							   + " WHERE ProductId = @Id";
				dbConnection.Open();
				return dbConnection.Query<Customer>(sQuery, new { Id = id }).FirstOrDefault();
			}
		}

		public void Delete(int id)
		{
			using (IDbConnection dbConnection = Connection)
			{
				string sQuery = "DELETE FROM Products"
							 + " WHERE ProductId = @Id";
				dbConnection.Open();
				dbConnection.Execute(sQuery, new { Id = id });
			}
		}

		public void Update(Customer prod)
		{
			using (IDbConnection dbConnection = Connection)
			{
				string sQuery = "UPDATE Products SET Name = @Name,"
							   + " Quantity = @Quantity, Price= @Price"
							   + " WHERE ProductId = @ProductId";
				dbConnection.Open();
				dbConnection.Query(sQuery, prod);
			}
		}
	}
}
