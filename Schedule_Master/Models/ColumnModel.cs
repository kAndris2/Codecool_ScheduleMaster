using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class ColumnModel
    {
        public int ID { get; }
        public int Schedule_ID { get; }
        public String Title { get; private set; }

        public List<SlotModel> Slots = new List<SlotModel>();

        public ColumnModel(int id, string title, int scheduleid)
        {
            ID = id;
            Title = title;
            Schedule_ID = scheduleid;
        }

        public void AddSlot(SlotModel slot) { Slots.Add(slot); }
    }
}
