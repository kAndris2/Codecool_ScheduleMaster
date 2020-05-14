using System;
using System.Collections.Generic;
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
        public List<ScheduleModel> GetSchedules() { return Singleton.Schedules; }

        [HttpGet("GetColumns")]
        public List<ColumnModel> GetColumns() { return Singleton.Columns; }

        [HttpGet("GetSlots")]
        public List<SlotModel> GetSlots() { return Singleton.Slots; }

        [HttpGet("GetTasks")]
        public List<TaskModel> GetTasks() { return Singleton.Tasks; }

        [HttpGet("schedule/{id}")]
        public ScheduleModel Schedule(int id)
        {
            ScheduleModel schedule = new ScheduleModel(122, "pinga", id);
            return schedule;
        }

        

    }
}