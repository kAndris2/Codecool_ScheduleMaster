using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Schedule_Master.Models;
using Schedule_Master;
using Schedule_Master.Services;

namespace Schedule_Master.Controllers
{
   
    [Route("[controller]")]
    public class AccountController : Controller
    {
        IDAO IDAO = IDAO.Singleton;

        [HttpGet]
        public ViewResult Register()
        {
            return View();
        }
        public class RegisterViewModel
        {
            [Required, MaxLength(256)]
            public string Username { get; set; }
            [Required, MaxLength(256)]
            public string Email { get; set; }

            [Required, DataType(DataType.Password)]
            public string Password { get; set; }

            [DataType(DataType.Password), Compare(nameof(Password))]
            public string ConfirmPassword { get; set; }

            public List<string> errors { get; set; }
        }

        [HttpPost ("Register")]
        public List<RegisterViewModel> Register(string[] regdata)
        {
            RegisterViewModel model = new RegisterViewModel();
            model.Username = regdata[0];
            model.Email = regdata[1];
            model.Password = regdata[2];
            model.ConfirmPassword = regdata[3];


            List<RegisterViewModel> all = new List<RegisterViewModel>();
            if (ModelState.IsValid)
            {
                List<UserModel> users = IDAO.Users;
                List<string> newErrors = new List<string>();
                bool err = false;
                foreach (UserModel user in users)
                {
                    if (user.Name == model.Username)
                    {
                        err = true;
                        newErrors.Add("User with this username already exists! Choose annnother one!");
                    }
                    else if (user.Email == model.Email)
                    {
                        err = true;
                        newErrors.Add("User with this e-mail already exists! Choose annnother one!");
                    }
                }
                if (model.Password != model.ConfirmPassword)
                {
                    err = true;
                    newErrors.Add("The two passwords you entered do not match!");
                }

                if (err)
                {
                    model.errors = newErrors;
                    all.Add(model);
                    return all;
                }
                else
                {
                    IDAO.Register(model.Username, model.Email, model.Password);
                    all.Add(model);
                    //await LoginAsync(model.Email, model.Password);
                    return all;
                }
            }
            else { return all; }
        }
        //logintest--------------------------------------------------------------------------------------------------------------
        //private readonly ILogger<AccountController> _logger;

        //private readonly IUserService _userService;

        //public AccountController(ILogger<AccountController> logger, IUserService userService)
        //{
        //    _userService = userService;
        //}

        //[HttpGet]
        //public IActionResult Login()
        //{
        //    return View();
        //}

        //[HttpPost]
        //public async Task<ActionResult> LoginAsync([FromForm] string email, [FromForm] string password)
        //{
        //    UserModel user = _userService.Login(email, password);
        //    if (user == null)
        //    {
        //        List<string> errors = new List<string>
        //        {
        //            "Invalid e-mail/password!"
        //        };
        //        ErrorViewModel err = new ErrorViewModel
        //        {
        //            Error = errors
        //        };
        //        return View(err);

        //    }

            //var claims = new List<Claim> { new Claim(ClaimTypes.Email, user.Email) };

            //var claimsIdentity = new ClaimsIdentity(
            //    claims, CookieAuthenticationDefaults.AuthenticationScheme);

            //var authProperties = new AuthenticationProperties
           // {
                //AllowRefresh = <bool>,
                // Refreshing the authentication session should be allowed.

                //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                // The time at which the authentication ticket expires. A 
                // value set here overrides the ExpireTimeSpan option of 
                // CookieAuthenticationOptions set with AddCookie.

                //IsPersistent = true,
                // Whether the authentication session is persisted across 
                // multiple requests. When used with cookies, controls
                // whether the cookie's lifetime is absolute (matching the
                // lifetime of the authentication ticket) or session-based.

                //IssuedUtc = <DateTimeOffset>,
                // The time at which the authentication ticket was issued.

                //RedirectUri = <string>
                // The full path or absolute URI to be used as an http 
                // redirect response value.
    //        };

        //    await HttpContext.SignInAsync(
        //        CookieAuthenticationDefaults.AuthenticationScheme,
        //        new ClaimsPrincipal(claimsIdentity),
        //        authProperties);

        //    return RedirectToAction("Index", "Home");
        //}

    //    [Authorize]
    //    [HttpGet]
    //    public async Task<IActionResult> LogoutAsync()
    //    {
    //        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    //        return RedirectToAction("Login", "Account");
    //    }
    }
}