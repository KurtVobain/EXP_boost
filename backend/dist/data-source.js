"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const ormconfig_json_1 = __importDefault(require("../ormconfig.json"));
dotenv.config();
const isDocker = process.env.NODE_ENV === "production";
const AppDataSource = new typeorm_1.DataSource(isDocker
    ? {
        type: "postgres",
        url: ormconfig_json_1.default.url,
        entities: ormconfig_json_1.default.entities,
        migrations: ormconfig_json_1.default.migrations,
        synchronize: ormconfig_json_1.default.synchronize,
        logging: ormconfig_json_1.default.logging,
    }
    : {
        type: process.env.DB_TYPE || "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "expboost",
        password: process.env.DB_PASSWORD || "mypassword",
        database: process.env.DB_NAME || "expboost",
        synchronize: false,
        logging: true,
        entities: ["src/entities/*.ts"],
        migrations: ["src/migrations/*.ts"],
    });
exports.default = AppDataSource;
