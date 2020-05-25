using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master.Models
{
    public class LogModel
    {
        public String Date { get; private set; }
        public String Message { get; private set; }

        public LogModel(string date,string message)
        {
            Date = date;
            Message = message;
        }
    }
}
