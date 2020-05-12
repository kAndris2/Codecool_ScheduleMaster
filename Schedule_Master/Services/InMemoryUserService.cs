using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Schedule_Master;
using Schedule_Master.Models;

namespace Schedule_Master.Services
{
    public class InMemoryUserService : IUserService
    {

        public IDAO IDAO = IDAO.Singleton;
        private List<UserModel> _users = new List<UserModel>();


        private bool loggedIn = false;
        public InMemoryUserService()
        {
            _users = IDAO.Users;

        }

        public List<UserModel> GetAll()
        {
            return _users;
        }

        public bool IsLoggedIn()
        {
            if (loggedIn)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public UserModel GetOne(int id)
        {
            return _users.FirstOrDefault(u => u.ID == id);
        }
        public UserModel GetOne(string email)
        {
            return _users.FirstOrDefault(u => u.Email == email);
        }

        public UserModel Login(string email, string password)
        {
            var user = GetOne(email);
            if (user == null)
            {
                loggedIn = false;
                return null;
            }
            if (user.Password != password)
            {
                loggedIn = false;
                return null;
            }
            loggedIn = true;
            return user;
        }

    }
}
