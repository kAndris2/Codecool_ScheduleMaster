using Npgsql;
using Schedule_Master.Models;
using System;
using System.Collections.Generic;
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
        /*
        public List<ColumnModel> Columns = new List<ColumnModel>();
        public List<SlotModel> Slots = new List<SlotModel>();
        public List<TaskModel> Tasks = new List<TaskModel>();
        */

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
                                "(name, email, password) " +
                                "VALUES " +
                                    "(@name, @email, @password)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("name", name);
                    cmd.Parameters.AddWithValue("email", email);
                    cmd.Parameters.AddWithValue("password", password);
                    cmd.ExecuteNonQuery();
                }
                id = int.Parse(GetLastIDFromTable(conn, "users"));
            }
            Users.Add(new UserModel(id, name, email, password));
        }

        //-Schedule Functions-----------------------------------------------------------------------

        public List<ScheduleModel> GetSchedules()
        {
            List<ScheduleModel> schedules = new List<ScheduleModel>();

            foreach (UserModel user in Users)
            {
                if (user.Schedules.Count >= 1)
                    schedules.AddRange(user.Schedules);
            }
            return schedules;
        }

        public void CreateSchedule(string title, int userid)
        {
            int id = 0;
            string sqlstr = "INSERT INTO schedules " +
                                "(title, userid) " +
                                "VALUES " +
                                    "(@title, @userid)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("userid", userid);
                    cmd.ExecuteNonQuery();
                }
                id = int.Parse(GetLastIDFromTable(conn, "schedules"));
            }
            GetUserByID(userid).AddSchedule(new ScheduleModel(id, title, userid));
        }

        public List<ScheduleModel> GetSchedule(int id)
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
        public void CreateColumn(string title, int scheduleid)
        {
            int id = 0;
            string sqlstr = "INSERT INTO columns " +
                                "(title, schedule_id) " +
                                "VALUES " +
                                    "(@title, @scheduleid)";
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(sqlstr, conn))
                {
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("scheduleid", scheduleid);
                    cmd.ExecuteNonQuery();
                }
                id = int.Parse(GetLastIDFromTable(conn, "columns"));
            }
            GetScheduleByID(scheduleid).AddColumn(new ColumnModel(id, title, scheduleid));
        }

        //-Slot Functions---------------------------------------------------------------------------
        public void CreateSlot(int columnid, int hour)
        {

        }

        //-Task Functions---------------------------------------------------------------------------
        public void CreateTask(string title, string content, int slotid)
        {

        }

        //-Other Functions---------------------------------------------------------------------------
        public String GetLastIDFromTable(NpgsqlConnection connection, string table)
        {
            string value = "";
            using (var cmd = new NpgsqlCommand($"SELECT * FROM {table}", connection))
            {
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    value = reader["id"].ToString();
                }
            }
            return value;
        }

        private void LoadFiles()
        {
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM users", conn))
                {
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Users.Add
                        (
                            new UserModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["name"].ToString(),
                            reader["email"].ToString(),
                            reader["password"].ToString()
                            )
                        );
                    }
                }
            }

            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM schedules", conn))
                {
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        ScheduleModel schedule = new ScheduleModel
                        (
                        int.Parse(reader["id"].ToString()),
                        reader["title"].ToString(),
                        int.Parse(reader["user_id"].ToString())
                        );
                        GetUserByID(schedule.User_ID).AddSchedule(schedule);
                    }
                }
            }

        /*
            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM columns", conn))
                {
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Columns.Add
                        (
                            new ColumnModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["title"].ToString(),
                            int.Parse(reader["schedule_id"].ToString())
                            )
                        );
                    }
                }
            }

            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM slots", conn))
                {
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Slots.Add
                        (
                            new SlotModel
                            (
                            int.Parse(reader["id"].ToString()),
                            int.Parse(reader["column_id"].ToString()),
                            int.Parse(reader["task_id"].ToString()),
                            int.Parse(reader["hour_value"].ToString())
                            )
                        );
                    }
                }
            }

            using (var conn = new NpgsqlConnection(Program.ConnectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand("SELECT * FROM tasks", conn))
                {
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Tasks.Add
                        (
                            new TaskModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["title"].ToString(),
                            reader["content"].ToString()
                            )
                        );
                    }
                }
            }
            */
        }
    }
}
