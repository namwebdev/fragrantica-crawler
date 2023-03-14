import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Perfume } from "./entities/Perfume";
import { Brand } from "./entities/Brand";
import { Accord } from "./entities/Accord";
import { Note } from "./entities/Note";
import { PerfumeAccord } from "./entities/Perfume_Accord";
import { PerfumeNote } from "./entities/Perfume_Note";
import { PerfumeWeather } from "./entities/Perfume_Weather";
import { PerfumeLongevity } from "./entities/Perfume_Longevity";
import { PerfumeSillage } from "./entities/Perfume_Sillage";
import { PerfumeGender } from "./entities/Perfume_Gender";

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
    entities: [
        Brand,
        Perfume,
        Accord,
        Note,
        PerfumeAccord,
        PerfumeNote,
        PerfumeWeather,
        PerfumeLongevity,
        PerfumeSillage,
        PerfumeGender,
    ],
    migrations: [],
    subscribers: [],
});
