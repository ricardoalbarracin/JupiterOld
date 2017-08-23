using ApplicationCore.Seg.Interfaces;
using ApplicationCore.SEG.Models;
using ApplicationCore.Utils.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Globalization;

namespace WebLayer.Controllers
{

    public class AccountController : Controller
    {
        IAccountBL _bl;
        public AccountController(IAccountBL bl)
        {
            _bl = bl;
            
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("es-ES");
            CultureInfo.CurrentUICulture = CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("es-ES");
            CultureInfo.CurrentCulture = CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("es-ES");

            base.OnActionExecuting(context);
        }
        [AllowAnonymous]
        public IActionResult Login(string ReturnUrl)
		{
			return View();
		}

        [AllowAnonymous]
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
