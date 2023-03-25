import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import * as fs from "fs";
import csv from "csv-parser";
import { crawl } from "./crawl";
import express from "express";
import cron from "node-cron";
import { perfumeDetailsCrawler } from "./crawlers/perfume";

dotenv.config();

// Create Express server
const port = process.env.PORT || 5000;
const app = express();

init();

function init() {
    const crawlHandler = () =>
        cron.schedule("*/1 * * * *", () => perfumeDetailsCrawler());

    connectDB(crawlHandler);
}

function connectDB(callback: () => void) {
    let retry = 0;
    AppDataSource.initialize()
        .then(() => {
            console.log("Connected to DB");

            app.use(express.json());
            app.listen(port, () =>
                console.log(`Now running on port ${port}\n`),
            );

            callback();
        })
        .catch(e => {
            if (retry === 3) {
                console.error(e);
                return
            }
            retry++;
            console.log(`Try count: ${retry}`);
            connectDB(callback);
        });
}
