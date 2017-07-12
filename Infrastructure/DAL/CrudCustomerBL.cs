using System.Data;
using ApplicationCore.SEG.Entities;
using ApplicationCore.Utils.Entities;
using ApplicationCore.Seg.Interfaces;
using ApplicationCore.Utils.Interfaces;

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
