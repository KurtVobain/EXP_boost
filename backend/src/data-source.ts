import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "myuser",
  password: "mypassword",
  database: "mydatabase",
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "entities/*.js")],
  migrations: [path.join(__dirname, "migrations/*.js")],
  subscribers: [],
});

export default AppDataSource;