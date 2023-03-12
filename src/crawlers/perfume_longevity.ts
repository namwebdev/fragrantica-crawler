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
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        const DOM = await page.$$(".grid-x.grid-padding-x.grid-padding-y");
        if (!DOM.length) {
            reject("Cannot DOM longevity step 1");
            return;
        }

        const _DOM = await DOM[1].$(".cell.small-12.medium-6 > div");
        if (!Validation.checkDOMSelectorAll(_DOM))
            reject("Cannot DOM longevity step 2");

        const containerDOM = await _DOM.$$(".vote-button-legend");
        if (!containerDOM.length) reject("Cannot DOM longevity container");

        const res = {} as PerfumeLongevity;
        res.id = null;
        res.perfume = perfume;
        for (let i = 0; i < containerDOM.length; i++) {
            if (!Validation.checkDOMCanEvaluate(containerDOM[i])) {
                reject("Cannot DOM longevity");
                break;
            }
            const property = await containerDOM[i].evaluate(e => e.textContent);
            res[longevityType[i]] = property;
        }
        await AppDataSource.getRepository(PerfumeLongevity).upsert(res, [
            "perfume",
        ]);
        console.log(`Done Longevity - perfume ${perfume.id}`);
        resolve();
    });
};
