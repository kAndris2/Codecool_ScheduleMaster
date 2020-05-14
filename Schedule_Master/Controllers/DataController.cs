using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Schedule_Master.Models;

namespace Schedule_Master.Controllers
{
    //[ApiController]
    [Route("[controller]")]
    public class DataController : Controller
    {
        IDAO Singleton = IDAO.Singleton;

        [HttpGet("GetUsers")]
        public List<UserModel> GetUsers() { return Singleton.Users; }

        [HttpGet("GetSchedules")]
        public List<ScheduleModel> GetSchedules() { return Singleton.GetSchedules(); }

        /*
        [HttpGet("GetColumns")]
        public List<ColumnModel> GetColumns() { return Singleton.Columns; }

        [HttpGet("GetSlots")]
        public List<SlotModel> GetSlots() { return Singleton.Slots; }

        [HttpGet("GetTasks")]
        public List<TaskModel> GetTasks() { return Singleton.Tasks; }
        */

        [HttpPost("Schedule")]
        public void Schedule(string[] table)
        {
            DateTime start = DateTime.ParseExact(table[1], "ddd MMM dd yyyy HH:mm:ss 'GMT'K", CultureInfo.InvariantCulture);
            DateTime end = DateTime.ParseExact(table[2], "ddd MMM dd yyyy HH:mm:ss 'GMT'K", CultureInfo.InvariantCulture);
            long start_m = (long)(start - new DateTime(1970, 1, 1)).TotalMilliseconds;
            long end_m = (long)(end - new DateTime(1970, 1, 1)).TotalMilliseconds;
            //
            Singleton.CreateSchedule(table[0], start_m, end_m, int.Parse(table[3]), table[4] == "true");
        }
    }
}