using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Schedule_Master.Models;

namespace Schedule_Master.Services
{
    public interface IUserService
    {
        public List<UserModel> GetAll();
        public UserModel GetOne(int id);
        public bool IsLoggedIn();
        public UserModel GetOne(string email);
        public UserModel Login(string email, string password);
    }
}
