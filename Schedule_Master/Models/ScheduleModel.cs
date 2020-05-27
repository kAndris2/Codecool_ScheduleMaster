using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class ScheduleModel
    {
        const int MAX_COLUMN = 7;
        public int ID { get; }
        public String Title { get; }
        public int User_ID { get; }

        public ColumnModel[] Columns = new ColumnModel[MAX_COLUMN];

        public ScheduleModel (int id, string title, int userid)
        {
            ID = id;
            Title = title;
            User_ID = userid;
        }

        public void AddColumn(ColumnModel column) 
        { 
            for (int i = 0; i < MAX_COLUMN; i++)
            {
                if (Columns[i] != null)
                {
                    Columns[i] = column;
                    break;
                }
            }
        }
    }
}
