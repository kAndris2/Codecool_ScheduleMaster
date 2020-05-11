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
        public int Task_ID { get; }
        public int HourValue { get; }

        public TaskModel Task { get; }

        public SlotModel(int id, int columnid, int taskid, int hour)
        {
            ID = id;
            Column_ID = columnid;
            Task_ID = taskid;
            HourValue = hour;
        }
    }
}
