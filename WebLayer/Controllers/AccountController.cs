using ApplicationCore.Seg.Interfaces;
using ApplicationCore.SEG.Models;
using ApplicationCore.Utils.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebLayer.Controllers
{

    public class AccountController : Controller
    {
        IAccountBL _bl;
        public AccountController(IAccountBL bl)
        {
            _bl = bl;
			


        }

		[AllowAnonymous]
        public IActionResult Login(string ReturnUrl)
		{
			return View();
		}

        [HttpPost]
        public IActionResult Login(Usuario usuario)
        {
			PasswordHasher<string> pw = new PasswordHasher<string>();
            var result = _bl.ObtenerUsuario(usuario.NombreUsuario);
			if (result.State == TransState.success)
			{
				var usuarioDb = result.Result as Usuario;
				var v2 = pw.VerifyHashedPassword(usuarioDb.NombreUsuario, usuarioDb.Clave, usuario.Clave);
			}
            return View();
        }

    }
}
