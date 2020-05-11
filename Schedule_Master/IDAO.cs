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

        public UserModel GetUserByID(int id)
        {
            return Users.FirstOrDefault(u => u.ID == id);
        }

        public ScheduleModel GetScheduleByID(int id)
        {
            return Schedules.FirstOrDefault(s => s.ID == id);
        }

        public ColumnModel GetColumnByID(int id)
        {
            return Columns.FirstOrDefault(c => c.ID == id);
        }

        public SlotModel GetSlotByID(int id)
        {
            return Slots.FirstOrDefault(s => s.ID == id);
        }

        public TaskModel GetTaskByID(int id)
        {
            return Tasks.FirstOrDefault(t => t.ID == id);
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
                        Schedules.Add
                        (
                            new ScheduleModel
                            (
                            int.Parse(reader["id"].ToString()),
                            reader["title"].ToString(),
                            int.Parse(reader["user_id"].ToString())
                            )
                        );
                    }
                }
            }

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
        }
    }
}
