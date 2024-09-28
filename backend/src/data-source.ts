import { DataSource } from "typeorm"
import { User } from "./entities/User"
import { Course } from "./entities/Course"
import { Task } from "./entities/Task"
import { UserCourse } from "./entities/UserCourse"
import { UserTask } from "./entities/UserTask"
import { BattlePass } from "./entities/BattlePass"
import { UserBattlePass } from "./entities/UserBattlePass"
import { CourseTask } from "./entities/CourseTask"
import * as dotenv from "dotenv"

dotenv.config()

const AppDataSource = new DataSource({
    type: (process.env.DB_TYPE as any) || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "expboost",
    password: process.env.DB_PASSWORD || "mypassword",
    database: process.env.DB_NAME || "expboost",
    synchronize: false,
    logging: true,
    entities: [
        User,
        Course,
        Task,
        UserCourse,
        UserTask,
        BattlePass,
        UserBattlePass,
        CourseTask,
    ],
    migrations: ["src/migrations/*.ts"],
})

export default AppDataSource
