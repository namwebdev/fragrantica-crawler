import { PerfumeGender } from "./../entities/Perfume_Gender";
import { Page } from "puppeteer";
import { Perfume } from "../entities/Perfume";
import { AppDataSource } from "../data-source";

enum genderType {
    female,
    unisex,
    male,
}

export const perfumeGenderCrawler = async (
    page: Page,
    perfume: Perfume,
    idx: number,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        const DOM = await page.$$(".cell.small-12.medium-6");
        if (!DOM.length) reject("Cannot DOM sillage step 1");

        const _DOM = await DOM[idx + 1].$$(".grid-x.grid-margin-x");
        if (!_DOM.length) reject("Cannot DOM sillage step 2");

        const res = {} as PerfumeGender;
        res.id = null;
        res.perfume = perfume;

        let femaleRate = 0;
        let maleRate = 0;
        for (let i = 0; i < _DOM.length; i++) {
            const valueDOM = await _DOM[i].$(".vote-button-legend");
            const rate = await valueDOM.evaluate(e => e.textContent);
            if (i === 0 || i === 1) femaleRate += toNumber(rate);
            else if (i === 2) res.unisex = rate;
            else if (i === 3 || i === 4) maleRate += toNumber(rate);
        }
        res.female = femaleRate.toString();
        res.male = maleRate.toString();
        await AppDataSource.getRepository(PerfumeGender).upsert(res, [
            "perfume",
        ]);
        console.log(`Done Gender - perfume ${perfume.id}`);
        resolve();
    });
};

const toNumber = (v: any): number => {
    const ret = Number(v);
    return isNaN(ret) ? 0 : ret;
};
