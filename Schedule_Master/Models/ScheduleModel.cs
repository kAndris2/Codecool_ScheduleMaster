using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class ScheduleModel
    {
        public int ID { get; }
        public String title { get; private set; }
        public int User_ID { get; }

        public string start { get; private set; }

        public List<ColumnModel> Columns = new List<ColumnModel>();

        public ScheduleModel(int id, string title, int userid)
        {
            ID = id;
            this.title = title;
            User_ID = userid;
            
        }
    }
}
