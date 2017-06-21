using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace WebLayer.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            CrudDapper crudDapper = new CrudDapper();
            Customer cus = new Customer()
            {
                CreateTime = DateTime.Now,
                Email = "ymcr11@gmail.com",
                FirstName = "yura",
                LastName = "Albarracin"
            };
            crudDapper.Add(cus);
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
