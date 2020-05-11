using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Schedule_Master.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IndexController : Controller
    {
        public IActionResult Get()
        {
            return new ViewResult();
        }
    }
}