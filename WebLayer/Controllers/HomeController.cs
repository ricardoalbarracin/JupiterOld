using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using ApplicationCore.Seg.BL;
using ApplicationCore.Seg.Services;
using Infrastructure;
using Infrastructure.Logging;
//using Infrastructure.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebLayer.Controllers
{


	
    public class HomeController : Controller
    {
        
        public HomeController (ICrudCustomerBL bl)
        {
            var asaaa= bl.GetListCustomer().Result[0];

        }
        public IActionResult Index()
        {
            HttpContext.Session.Set("dfs", new byte[0]);


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

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
