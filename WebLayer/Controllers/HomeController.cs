using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApplicationCore.Models;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace WebLayer.Controllers
{
    public class HomeController : Controller
    {

        public HomeController (IConfigurationRoot configuration)
        {

            CrudDapper a = new CrudDapper(configuration);
        }
        public IActionResult Index()
        {
            
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
