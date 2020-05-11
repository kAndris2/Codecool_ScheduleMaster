using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Schedule_Master.Models;

namespace Schedule_Master.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DataController : Controller
    {
        IDAO Singleton = IDAO.Singleton;

        [HttpGet]
        public List<UserModel> GetUsers() { return Singleton.Users; }
        [HttpGet]
        public List<ScheduleModel> GetSchedules() { return Singleton.Schedules; }
        [HttpGet]
        public List<ColumnModel> GetColumns() { return Singleton.Columns; }
        [HttpGet]
        public List<SlotModel> GetSlots() { return Singleton.Slots; }
        [HttpGet]
        public List<TaskModel> GetTasks() { return Singleton.Tasks; }
    }
}