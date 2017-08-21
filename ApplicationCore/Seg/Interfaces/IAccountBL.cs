using System;
using ApplicationCore.Utils.Models;

namespace ApplicationCore.Seg.Interfaces
{
    public interface IAccountBL
    {
        Transaction ObtenerUsuario(string nombreUsuario);
    }
		
}
