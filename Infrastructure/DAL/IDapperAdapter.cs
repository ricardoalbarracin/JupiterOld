using System;
using System.Data;
using ApplicationCore.Gen.Models;

namespace Infrastructure.DAL
{
    public interface IDapperAdapter
    {
        IDbConnection GetConnection();

        Transaction Query<T>(string sql, object param = null,
                             IDbTransaction transaction = null);
    }
}
