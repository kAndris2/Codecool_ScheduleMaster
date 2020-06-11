using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class TaskModel
    {
        public int ID { get; }
        public int Slot_ID { get; }
        public String Title { get; private set; }
        public String Content { get; private set; }

        public TaskModel(int id, string title, int slotid)
        {
            ID = id;
            Title = title;
            Slot_ID = slotid;
        }

        public void Update(string title)
        {
            Title = title;
        }
    }
}
