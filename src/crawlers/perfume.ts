import puppeteer from "puppeteer";
import { Perfume } from "./../entities/Perfume";
import { AppDataSource } from "./../data-source";
import { accordsCrawler } from "./accords";
import { notesCrawler } from "./notes";

export const perfumeDetailsCrawler = async (
    _perfumeId: number,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        const perfume = await AppDataSource.getRepository(Perfume).findOne({
            where: { id: _perfumeId },
        });
        if (!perfume) reject(`Cannot get Perfume with id ${_perfumeId}`);

        const _link = perfume.link;
        if (!_link)
            reject(
                `Cannot get link of Perfume: ${perfume.name}, id: ${perfume.id}`,
            );
        const browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            defaultViewport: { width: 1920, height: 1080 },
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

            await accordsCrawler(page, perfume);
            console.log("\n");
            await notesCrawler(page, perfume);
            resolve();
        } catch (err) {
            console.error(err);
        } finally {
            browser.close();
        }
    });
};
