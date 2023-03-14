import { PerfumeWeather } from "./../entities/Perfume_Weather";
import { AppDataSource } from "./../data-source";
import { Validation } from "./../utils/Validation";
import { Page } from "puppeteer";
import { Perfume } from "./../entities/Perfume";

enum weatherType {
    winter,
    spring,
    summer,
    fall,
    day,
    night,
}

export const perfumeWeatherCrawler = (
    page: Page,
    perfume: Perfume,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        const DOM = await page.$(
            ".cell.small-12 > div > .cell.small-12:nth-of-type(2) > .grid-x.grid-margin-x.grid-margin-y:nth-of-type(4) > .cell.small-6:nth-of-type(2) > div",
        );
        if (!Validation.checkDOMSelectorAll(DOM))
            reject("Cannot DOM perfume weather");

        const _wea = await DOM.$$(".voting-small-chart-size");
        if (!_wea?.length) reject("Cannot DOM list weather");

        const res = {} as PerfumeWeather;
        res.id = null;
        res.perfume = perfume;
        for (let i = 0; i < _wea.length; i++) {
            const _DOM = await _wea[i].$("div > div[style*='opacity: 1;']");
            if (!Validation.checkDOMCanEvaluate(_DOM))
                reject("Cannot DOM weather");

            const style = await _DOM.evaluate(e => e.getAttribute("style"));
            res[weatherType[i]] = getWeatherRate(style);
        }
        await AppDataSource.getRepository(PerfumeWeather).upsert(res, [
            "perfume",
        ]);
        console.log(`Done Weather - perfume ${perfume.id}`);
        resolve();
    });
};

const getWeatherRate = (styleText: string) => {
    const _styleArr = styleText.split(";");
    const styleArr = _styleArr.filter(function (value) {
        return value.includes("width");
    });
    const value = styleArr[0]
        .slice(styleArr[0].indexOf(":") + 1)
        .replace("%", "")
        .trim();
    return value;
};
