using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using ApplicationCore.Seg.BL;
using ApplicationCore.Seg.Interfaces;
using Infrastructure;
using Infrastructure.Logging;
//using Infrastructure.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WebLayer.Fliters;

namespace WebLayer.Controllers
{


	
    public class HomeController : Controller
    {
        ICrudCustomerBL _bl;
        public HomeController (ICrudCustomerBL bl)
        {
            _bl = bl;

        }

        [HasPermissionAttribute("")]
        public IActionResult Index()
        {
            HttpContext.Session.Set("dfs", new byte[0]);

			var asaaa = _bl.GetListCustomer().Result[0];
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";
            int b=0;
            int a = 1 /b;
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
