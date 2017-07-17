using ApplicationCore.Seg.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebLayer.Controllers
{

    public class AccountController : Controller
    {
        ICrudCustomerBL _bl;
        public AccountController(ICrudCustomerBL bl)
        {
            _bl = bl;
        }

		[AllowAnonymous]
        public IActionResult Login(string ReturnUrl)
		{
			return View();
		}
    }
}
