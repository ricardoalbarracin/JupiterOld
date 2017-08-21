using System.Data;
using ApplicationCore.SEG.Models;
using ApplicationCore.Utils.Models;
using ApplicationCore.Seg.Interfaces;
using ApplicationCore.Utils.Interfaces;
using System;

namespace ApplicationCore.Seg.BL
{
	/// <summary>
	/// Clase que implementa el servio  IDbTransaction.
	/// </summary>
	public class AccountBL : IAccountBL
	{
        private readonly IDapperAdapter _IDapperAdapter;

		public AccountBL(IDapperAdapter IDapperAdapter)
		{
            _IDapperAdapter = IDapperAdapter;

		}

        Transaction IAccountBL.ObtenerUsuario(string nombreUsuario)
        {
			using (IDbConnection dbConnection = _IDapperAdapter.GetConnection())
			{
                var result = new Transaction();
				dbConnection.Open();
	            var u = new Usuario()
	            {
	                NombreUsuario = nombreUsuario
	            };
                var resultDB = _IDapperAdapter.Query<Usuario>("exec SEG.GetUsuario @NombreUsuario = @NombreUsuario;", u);
                if (resultDB.State == TransState.success)
                {
                    result.Result = resultDB.Result[0];
                    result.State = TransState.success;
                }
                return result;
			}
        }
    }
}
