﻿using ApplicationCore.Seg.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace WebLayer.Controllers
{


	
    public class HomeController : Controller
    {
        IAccountBL _bl;
        public HomeController (IAccountBL bl)
        {
            _bl = bl;
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
        public IActionResult InsEstadoAfiliacion()
        {

            return PartialView();
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
