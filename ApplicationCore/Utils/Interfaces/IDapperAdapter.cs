using System.Data;
using ApplicationCore.Utils.Entities;

namespace ApplicationCore.Utils.Interfaces
{
    public interface IDapperAdapter
    {
        IDbConnection GetConnection();

        Transaction Query<T>(string sql, object param = null,
                             IDbTransaction transaction = null);
    }
}
