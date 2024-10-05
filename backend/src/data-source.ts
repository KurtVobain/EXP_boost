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
import ormconfig from "../ormconfig.json"
import { config } from "./config"

dotenv.config()

const isDocker = process.env.NODE_ENV === "production"

const AppDataSource = new DataSource(
    isDocker
        ? {
              type: process.env.DB_TYPE as any,
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT),
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              synchronize: false,
              logging: true,
              entities: ["dist/entities/**/*.js"],
              migrations: ["dist/migrations/**/*.js"],
              ssl: { rejectUnauthorized: false },
          }
        : {
              type: (process.env.DB_TYPE as any) || "postgres",
              host: config.db.host,
              port: config.db.port || 5432,
              username: config.db.username,
              password: config.db.password,
              database: config.db.name,
              synchronize: false,
              logging: true,
              entities: ["dist/entities/**/*.js"],
              migrations: ["dist/migrations/**/*.js"],
              ssl: { rejectUnauthorized: false },
          },
)

export default AppDataSource
