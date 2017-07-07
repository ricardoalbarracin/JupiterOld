﻿﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Npgsql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NLog;
using Infrastructure;
using ApplicationCore.SEG.Models;
using ApplicationCore.Gen.Models;
using ApplicationCore.Seg.Services;
using Microsoft.AspNetCore.Http;
using Infrastructure.Logging;
using Infrastructure.DAL;

namespace ApplicationCore.Seg.BL
{
	
	public class CrudCustomerBL : ICrudCustomerBL
	{
        private readonly IDapperAdapter _IDapperAdapter;

		public CrudCustomerBL(IDapperAdapter IDapperAdapter)
		{
            _IDapperAdapter = IDapperAdapter;

		}

		

        Transaction ICrudCustomerBL.GetListCustomer()
        {
           
			using (IDbConnection dbConnection = _IDapperAdapter.GetConnection())
			{
				dbConnection.Open();
				return _IDapperAdapter.Query<Customer>("SELECT id, firstname, lastname, email, createtime  FROM public.customer;");
			}
        }
    }
}
