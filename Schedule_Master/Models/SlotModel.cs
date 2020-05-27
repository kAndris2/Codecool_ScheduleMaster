using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class SlotModel
    {
        public int ID { get; }
        public int Column_ID { get; }
        public int HourValue { get; }

        public List<TaskModel> Tasks = new List<TaskModel>();

        public SlotModel(int id, int columnid, int hour)
        {
            ID = id;
            Column_ID = columnid;
            HourValue = hour;
        }

        public void AddTask(TaskModel task) { Tasks.Add(task); }
        public void RemoveTask(int taskid) { Tasks.Remove(Tasks.FirstOrDefault(t => t.ID == taskid)); }
    }
}
