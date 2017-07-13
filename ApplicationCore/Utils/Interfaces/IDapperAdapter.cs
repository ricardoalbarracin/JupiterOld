using System.Data;
using ApplicationCore.Utils.Models;

namespace ApplicationCore.Utils.Interfaces
{
    /// <summary>
    /// Interfaz que define el comportamiento del servicio de acceso a datos.
    /// </summary>
    public interface IDapperAdapter
    {
		/// <summary>
		/// Obtiene una IDbConnection.
		/// </summary>
		/// <returns>The connection.</returns>
		IDbConnection GetConnection();

		/// <summary>
		/// Metodo que realiza una consulta a la base de datos y lo mapea en un objeto T.
		/// </summary>
		/// <returns>Retorna una transacción.</returns>
		/// <param name="sql">Sentencia SQL de la consulta.</param>
		/// <param name="param">Parametros de la consulta.</param>
		/// <param name="transaction">IDbTransaction.</param>
		/// <typeparam name="T">The 1st type parameter.</typeparam>
		Transaction Query<T>(string sql, object param = null,
                             IDbTransaction transaction = null);
    }
}
