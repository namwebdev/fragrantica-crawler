import { Perfume } from "./entities/Perfume";
import { Brand } from "./entities/Brand";
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Accord } from "./entities/Accord";
import { Note } from "./entities/note";
import { PerfumeAccord } from "./entities/Perfume_Accord";
import { PerfumeNote } from "./entities/Perfume_Note";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Brand, Perfume, Accord, Note, PerfumeAccord, PerfumeNote],
    migrations: [],
    subscribers: [],
});
