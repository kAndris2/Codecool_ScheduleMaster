using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class ScheduleModel
    {
        public int ID { get; }
        public String Title { get; private set; }
        public int User_ID { get; }

        public List<ColumnModel> Columns = new List<ColumnModel>();

        public ScheduleModel(int id, string title, int userid)
        {
            ID = id;
            Title = title;
            User_ID = userid;
        }
    }
}
