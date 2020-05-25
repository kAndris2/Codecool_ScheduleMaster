using Microsoft.AspNetCore.Http.Features;
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
        public String Role { get; private set; }

        public List<String> Errors { get; set; }

        public List<ScheduleModel> Schedules = new List<ScheduleModel>();
    
        public string cookie { get; set; }

        public UserModel(int id, string name, string email, string password, string role)
        {
            ID = id;
            Name = name;
            Email = email;
            Password = password;
            Role = role;
        }

        public void AddSchedule(ScheduleModel schedule) { Schedules.Add(schedule); }
    }
}
