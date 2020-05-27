using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class ColumnModel
    {
        const int MAX_SLOT = 24;
        public int ID { get; }
        public int Schedule_ID { get; }
        public String Title { get; private set; }

        public SlotModel[] Slots = new SlotModel[MAX_SLOT];

        public ColumnModel(int id, string title, int scheduleid)
        {
            ID = id;
            Title = title;
            Schedule_ID = scheduleid;
        }

        public void AddSlot(SlotModel slot) 
        { 
            for (int i = 0; i < MAX_SLOT; i++)
            {
                if (Slots[i] != null)
                {
                    Slots[i] = slot;
                    break;
                }
            }
        }
    }
}
