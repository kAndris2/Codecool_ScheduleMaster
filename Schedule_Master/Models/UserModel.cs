using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class UserModel
    {
        public int ID { get; }
        public String Name { get; private set; }
        public String Email { get; private set; }
        public String Password { get; private set; }

        public List<ScheduleModel> Schedules = new List<ScheduleModel>();
    
        public UserModel(int id, string name, string email, string password)
        {
            ID = id;
            Name = name;
            Email = email;
            Password = password;
        }
    }
}
