using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class TaskModel
    {
        public int ID { get; }
        public String Title { get; private set; }
        public String Content { get; private set; }

        public TaskModel(int id, string title, string content)
        {
            ID = id;
            Title = title;
            Content = content;
        }
    }
}
