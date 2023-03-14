import { PerfumeSillage } from "./../entities/Perfume_Sillage";
import { Page } from "puppeteer";
import { Perfume } from "./../entities/Perfume";
import { AppDataSource } from "../data-source";

enum sillageType {
    intimate,
    moderate,
    strong,
    enormous,
}

export const perfumeSillageCrawler = async (
    page: Page,
    perfume: Perfume,
): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const DOM = await page.$$(".cell.small-12.medium-6");
        if (!DOM.length) reject("Cannot DOM sillage step 1");

        const _DOM = await DOM[3].$$(".grid-x.grid-margin-x");
        if (!_DOM.length) reject("Cannot DOM sillage step 2");

        const res = {} as PerfumeSillage;
        res.id = null;
        res.perfume = perfume;
        for (let i = 0; i < _DOM.length; i++) {
            const valueDOM = await _DOM[i].$(".vote-button-legend");
            const rate = await valueDOM.evaluate(e => e.textContent);
            res[sillageType[i]] = rate;
        }
        await AppDataSource.getRepository(PerfumeSillage).upsert(res, [
            "perfume",
        ]);

        console.log(`Done Sillage - perfume ${perfume.id}`);
        resolve();
    });
};
