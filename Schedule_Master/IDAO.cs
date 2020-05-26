using Microsoft.AspNetCore.Routing;
using Npgsql;
using Schedule_Master.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Schedule_Master
{
    public class IDAO
    {

        //HOW TO CREATE A PASS:
        //INSERT into "users" (name, email, password) VALUES('testuser','testmail@pass', crypt('password', gen_salt('bf')));

        //UPDATE THE PASS:
        //UPDATE table SET password = crypt('password', gen_salt('bf'))

        //VALIDATE THE PASS:
        //SELECT ... FROM table
        //    WHERE password is NOT NULL
        //        AND password = crypt('password-to-test', password);
        //PL.:
        //SELECT name FROM users
        //    WHERE password is NOT NULL
        //        AND password = crypt('password', password);
        //RETURNS: => testuser

        static IDAO instance = null;
        public static IDAO Singleton
        {
            get
            {
                if (instance == null)
                {
                    instance = new IDAO();
                }
                return instance;
            }
        }

        public List<UserModel> Users = new List<UserModel>();
        public List<ScheduleModel> Schedules = new List<ScheduleModel>();
        public List<ColumnModel> Columns = new List<ColumnModel>();
        public List<SlotModel> Slots = new List<SlotModel>();
        public List<TaskModel> Tasks = new List<TaskModel>();

        private IDAO()
        {
            LoadFiles();
        }

        //-User Functions---------------------------------------------------------------------------
        public UserModel GetUserByID(int id)
        {
            return Users.FirstOrDefault(u => u.ID == id);
        }

        public void Register(string name, string email, string password)
        {
            int id = 0;
            string sqlstr = "INSERT INTO users " +
                                "(name, email, password, role) " +
                                "VALUES " +
                                    "(@name, @email, @password, @role)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("name", name);
                    cmd.Parameters.AddWithValue("email", email);
                    cmd.Parameters.AddWithValue("password", password);
                    cmd.Parameters.AddWithValue("role", "user");
                    cmd.ExecuteNonQuery();
                }
                id = int.Parse(GetLastIDFromTable(conn, "users"));
            }
            Users.Add(new UserModel(id, name, email, password,"user"));
        }

        public void AddToLog(int userid, string message)
        {
            DateTime localDate = DateTime.Now;
            String[] cultureNames = { "hu-HU" };

            var culture = new CultureInfo(cultureNames[0]);
            
            string date = localDate.ToString(culture);
            

            string sqlstr = "INSERT INTO logs " +
                                "(date, message) " +
                                "VALUES " +
                                    "(@date, @message)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("date", date);
                    cmd.Parameters.AddWithValue("message", "User with id:"+ userid + " : " + message);
                    cmd.ExecuteNonQuery();
                }
               
            }
        }

        public List<LogModel> ReadLog()
        {
            List<LogModel> logs = new List<LogModel>();
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM logs", conn))
                {
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {

                        logs.Add(
                            new LogModel
                        (
                        reader["date"].ToString(),
                        reader["message"].ToString()
                        ));
                       
                    }
                }
            }
            return logs;
        }

        //-Schedule Functions-----------------------------------------------------------------------

        public List<ScheduleModel> GetSchedules()
        {
            /*
            List<ScheduleModel> schedules = new List<ScheduleModel>();

            foreach (UserModel user in Users)
            {
                if (user.Schedules.Count >= 1)
                    schedules.AddRange(user.Schedules);
            }
            return schedules;
            */
            return Schedules;
        }

        public void CreateSchedule(string title, int userid)
        {
            int id = 0;
            string sqlstr = "INSERT INTO schedules " +
                                "(title, user_id) " +
                                "VALUES " +
                                    "(@title, @user_id)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("user_id", userid);
                    cmd.ExecuteNonQuery();
                }
                id = int.Parse(GetLastIDFromTable(conn, "schedules"));
            }
            //GetUserByID(userid).AddSchedule(new ScheduleModel(id, title, userid));
            Schedules.Add(new ScheduleModel(id, title, userid));
            CreateColumnsAndSlots(id);
        }

        public List<ScheduleModel> GetSchedule(int id) //user id
        {
            List<ScheduleModel> all = new List<ScheduleModel>();
            foreach (ScheduleModel schedule in GetSchedules())
            {
                if (schedule.User_ID == id) { all.Add(schedule); }
            }
            if (all.Count > 0) { return all; }
            else { return null; }

        }

        public ScheduleModel GetScheduleByID(int id)
        {
            return GetSchedules().FirstOrDefault(s => s.ID == id);
        }

        //-Column Functions-------------------------------------------------------------------------
        private int CreateColumn(NpgsqlConnection connection, string title, int scheduleid)
        {
            int id = 0;
            string sqlstr = "INSERT INTO columns " +
                                "(title, schedule_id) " +
                                "VALUES " +
                                    "(@title, @scheduleid)";
            using (var cmd = new NpgsqlCommand(sqlstr, connection))
            {
                cmd.Parameters.AddWithValue("title", title);
                cmd.Parameters.AddWithValue("scheduleid", scheduleid);
                cmd.ExecuteNonQuery();
            }
            id = int.Parse(GetLastIDFromTable(connection, "columns"));
            //GetScheduleByID(scheduleid).AddColumn(new ColumnModel(id, title, scheduleid));
            Columns.Add(new ColumnModel(id, title, scheduleid));

            return id;
        }

        public ColumnModel GetColumnByID(int id)
        {
            foreach (ColumnModel column in GetColumns())
            {
                if (column.ID.Equals(id))
                    return column;
            }
            throw new ArgumentException($"Invalid Column ID! ('{id}')");
        }

        public List<ColumnModel> GetColumns()
        {
            /*
            List<ColumnModel> columns = new List<ColumnModel>();

            foreach(ScheduleModel schedule in GetSchedules())
            {
                columns.AddRange(schedule.Columns);
            }

            return columns;
            */
            return Columns;
        }

        //-Slot Functions---------------------------------------------------------------------------
        private void CreateSlot(NpgsqlConnection connection, int columnid, int hour)
        {
            int id = 0;
            string sqlstr = "INSERT INTO slots " +
                                "(column_id, hour_value) " +
                                "VALUES " +
                                    "(@columnid, @hour)";
            using (var cmd = new NpgsqlCommand(sqlstr, connection))
            {
                cmd.Parameters.AddWithValue("columnid", columnid);
                cmd.Parameters.AddWithValue("hour", hour);
                cmd.ExecuteNonQuery();
            }
            id = int.Parse(GetLastIDFromTable(connection, "slots"));
            //GetColumnByID(columnid).AddSlot(new SlotModel(id, columnid, hour));
            Slots.Add(new SlotModel(id, columnid, hour));
        }

        public List<SlotModel> GetSlots()
        {
            /*
            List<SlotModel> slots = new List<SlotModel>();

            foreach (ColumnModel column in GetColumns())
            {
                slots.AddRange(column.Slots);
            }

            return slots;
            */
            return Slots;
        }

        public SlotModel GetSlotByID(int id)
        {
            return GetSlots().FirstOrDefault(s => s.ID == id);
        }

        //-Task Functions---------------------------------------------------------------------------
        public void CreateTask(string title, string content, int slotid)
        {
            int id = 0;
            string sqlstr = "INSERT INTO tasks " +
                                "(title, content, slot_id) " +
                                "VALUES " +
                                    "(@title, @content, @slotid)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("content", content);
                    cmd.Parameters.AddWithValue("slotid", slotid);
                    cmd.ExecuteNonQuery();
                }
                id = int.Parse(GetLastIDFromTable(conn, "tasks"));
            }
            //GetSlotByID(slotid).AddTask(new TaskModel(id, title, content, slotid));
            Tasks.Add(new TaskModel(id, title, content, slotid));
        }

        public List<TaskModel> GetTasks()
        {
            /*
            List<TaskModel> tasks = new List<TaskModel>();

            foreach(SlotModel slot in GetSlots())
            {
                tasks.AddRange(slot.Tasks);
            }

            return tasks;
            */
            return Tasks;
        }

        public TaskModel GetTaskByID(int id)
        {
            return GetTasks().FirstOrDefault(t => t.ID == id);
        }

        //-Other Functions---------------------------------------------------------------------------
        private String GetLastIDFromTable(NpgsqlConnection connection, string table)
        {
            string value = "";
            using (var cmd = new NpgsqlCommand($"SELECT * FROM {table}", connection))
            {
                using var reader = cmd.ExecuteReader();
                reader.Read();
                value = reader["id"].ToString();
                /*
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        value = reader["id"].ToString();
                    }
                }
                */
            }
            return value;
        }

        private void CreateColumnsAndSlots(int scheduleid)
        {
            string[] Days = new string[7]
            {
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            };

            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();

                for (int i = 0; i < Days.Length; i++)
                {
                    int columnid = CreateColumn(conn, Days[i], scheduleid);

                    for (int n = 0; n < 24; n++)
                    {
                        CreateSlot(conn, columnid, n + 1);
                    }
                }
            }
        }

        private void LoadFiles()
        {
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM users", conn))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Users.Add
                            (
                                new UserModel
                                (
                                int.Parse(reader["id"].ToString()),
                                reader["name"].ToString(),
                                reader["email"].ToString(),
                                reader["password"].ToString(),
                                reader["role"].ToString()
                                )
                            );
                        }
                    }
                }
          
                using (var cmd = new NpgsqlCommand("SELECT * FROM schedules", conn))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ScheduleModel schedule = new ScheduleModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["title"].ToString(),
                            int.Parse(reader["user_id"].ToString())
                            );
                            //GetUserByID(schedule.User_ID).AddSchedule(schedule);
                            Schedules.Add(schedule);
                        }
                    }
                }
           
                using (var cmd = new NpgsqlCommand("SELECT * FROM columns", conn))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ColumnModel column = new ColumnModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["title"].ToString(),
                            int.Parse(reader["schedule_id"].ToString())
                            );
                            //GetScheduleByID(column.Schedule_ID).AddColumn(column);
                            Columns.Add(column);
                        }
                    }
                }
          
                using (var cmd = new NpgsqlCommand("SELECT * FROM slots", conn))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            SlotModel slot = new SlotModel
                            (
                            int.Parse(reader["id"].ToString()),
                            int.Parse(reader["column_id"].ToString()),
                            int.Parse(reader["hour_value"].ToString())
                            );
                            //GetColumnByID(slot.Column_ID).AddSlot(slot);
                            Slots.Add(slot);
                        }
                    }
                }
            
                using (var cmd = new NpgsqlCommand("SELECT * FROM tasks", conn))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            TaskModel task = new TaskModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["title"].ToString(),
                            reader["content"].ToString(),
                            int.Parse(reader["slot_id"].ToString())
                            );
                            //GetSlotByID(task.Slot_ID).AddTask(task);
                            Tasks.Add(task);
                        }
                    }
                }
            }
        }
    }
}
