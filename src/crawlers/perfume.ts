import { PerfumeGender } from "./../entities/Perfume_Gender";
import puppeteer from "puppeteer";
import { Perfume } from "./../entities/Perfume";
import { AppDataSource } from "./../data-source";
import { accordsCrawler } from "./accords";
import { notesCrawler } from "./notes";
import { perfumeWeatherCrawler } from "./perfume_weather";
import { perfumeLongevityCrawler } from "./perfume_longevity";
import { perfumeSillageCrawler } from "./perfume_sillage";
import { perfumeGenderCrawler } from "./perfume_gender";

export const perfumeDetailsCrawler = async (): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        let _perfumeId = 1;
        const latestRecord = await AppDataSource.getRepository(
            PerfumeGender,
        ).findOne({ where: {}, order: { id: "DESC" }, relations: ["perfume"] });
        if (latestRecord && latestRecord?.perfume?.id)
            _perfumeId = latestRecord.perfume.id + 1;

        const perfume = await getPerfume(_perfumeId)

        const _link = perfume.link;
        if (!_link)
            throw Error(
                `Cannot get link of Perfume: ${perfume.name}, id: ${perfume.id}`,
            );
        const browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            defaultViewport: { width: 1920, height: 1080 },
            args: ["--disable-gpu"],
        });
        try {
            const page = await browser.newPage();

            await page.goto(_link, {
                waitUntil: "domcontentloaded",
            });
            await page.waitForTimeout(1000);
            await page.evaluate(() =>
                window.scrollTo(0, document.body.scrollHeight),
            );

            console.log(`Start crawl: perfume ${perfume.id}`);
            await accordsCrawler(page, perfume);
            await notesCrawler(page, perfume);
            await perfumeWeatherCrawler(page, perfume);
            const i = await perfumeLongevityCrawler(page, perfume);
            await perfumeSillageCrawler(page, perfume, i);
            await perfumeGenderCrawler(page, perfume, i);
            console.log("\n");
            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        } finally {
            browser.close();
        }
    });
};

const getPerfume = async (id: number) => {
    const perfume = await AppDataSource.getRepository(Perfume).findOne({
        where: { id },
    });
    if (!perfume) return getPerfume(id + 1);
    return perfume
};
