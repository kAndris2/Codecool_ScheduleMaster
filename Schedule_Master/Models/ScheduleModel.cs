using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class ScheduleModel
    {
        public int ID { get; }
        public String Title { get; }
        //public String Url { get; }
        public int User_ID { get; }
        //public long Start { get; }
        //public long End { get; }
        //public bool Allday { get; }

        public List<ColumnModel> Columns = new List<ColumnModel>();

        /*
        public ScheduleModel(int id, string title, int userid, long start, long end, bool allday)
        {
            ID = id;
            Title = title;
            User_ID = userid;
            Start = start;
            End = end;
            Allday = allday;
        }
        */

        public ScheduleModel (int id, string title, int userid)
        {
            ID = id;
            Title = title;
            User_ID = userid;
        }

        public void AddColumn(ColumnModel column) { Columns.Add(column); }
    }
}
