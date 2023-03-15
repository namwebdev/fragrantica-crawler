import { PerfumeLongevity } from "./../entities/Perfume_Longevity";
import { Page } from "puppeteer";
import { Validation } from "./../utils/Validation";
import { Perfume } from "./../entities/Perfume";
import { AppDataSource } from "./../data-source";

enum longevityType {
    very_weak,
    weak,
    moderate,
    long_lasting,
    eternal,
}

export const perfumeLongevityCrawler = (
    page: Page,
    perfume: Perfume,
): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        let idx = 2;
        try {
            const DOM = await page.$$(".cell.small-12.medium-6");
            if (!DOM.length) throw Error("Cannot DOM longevity step 1");

            let _DOM = await DOM[idx].$$(".grid-x.grid-margin-x");
            if (!_DOM.length) {
                idx = 4;
                _DOM = await DOM[idx].$$(".grid-x.grid-margin-x");
                if (!_DOM.length) throw Error("Cannot DOM longevity step 2");
            }

            const res = {} as PerfumeLongevity;
            res.id = null;
            res.perfume = perfume;
            for (let i = 0; i < _DOM.length; i++) {
                const valueDOM = await _DOM[i].$(".vote-button-legend");
                const rate = await valueDOM.evaluate(e => e.textContent);
                res[longevityType[i]] = rate;
            }
            await AppDataSource.getRepository(PerfumeLongevity).upsert(res, [
                "perfume",
            ]);
            console.log(`Done Longevity - perfume ${perfume.id}`);
            resolve(idx);
        } catch (e) {
            reject(e);
        }
    });
};
