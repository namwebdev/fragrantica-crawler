import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import * as fs from "fs";
import csv from "csv-parser";
import { crawl, crawlPerfumeLinks } from "./crawl";
import express from "express";
import cron from "node-cron";

dotenv.config();

// Create Express server
const port = process.env.PORT || 5000;
const app = express();

AppDataSource.initialize()
    .then(() => {
        console.log("Connected to DB");

        app.use(express.json());
        app.listen(port, () => console.log(`Now running on port ${port}`));

        // const res = [];
        // let links: string[] = [];
        // fs.createReadStream("data.csv")
        //     .pipe(csv({}))
        //     .on("data", data => {
        //         res.push(data);
        //     })
        //     .on("end", () => {
        //         links = res.map(i => i["﻿link"]);
        //         cron.schedule("*/4 * * * *", () => crawl(links));
        //     });
        // crawlPerfumeLinks();
        cron.schedule("*/3 * * * *", () => crawlPerfumeLinks());
    })
    .catch(error => console.log(error));
