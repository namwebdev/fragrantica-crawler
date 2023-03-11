import { Page } from "puppeteer";
import { Accord } from "./../entities/Accord";
import { AppDataSource } from "./../data-source";
import { Perfume } from "./../entities/Perfume";
import { PerfumeAccord } from "./../entities/Perfume_Accord";

export const accordsCrawler = async (
    page: Page,
    perfume: Perfume,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        await page.waitForSelector(".cell.accord-box", {
            visible: true,
        });
        const DOM = await page.$(
            ".grid-x.grid-margin-x.grid-margin-y > .cell.small-6.text-center:nth-of-type(2) > .grid-x",
        );
        const accords = await DOM.$$(".cell.accord-box");
        if (!accords || accords.length === 0)
            reject(`Cannot get list Accord ${perfume.id}`);

        for (let i = 0; i < accords.length; i++) {
            const _DOM = await accords[i].$(".accord-bar");
            const name = await _DOM.evaluate(e => e.textContent);
            const style = await _DOM.evaluate(e => e.getAttribute("style"));
            const properties = getAccordProperties(style);

            let _accord = await AppDataSource.getRepository(Accord).findOne({
                where: { name },
            });
            if (!_accord) {
                const accord = new Accord();
                accord.name = name;
                accord.color = properties.color;
                accord.background_color = properties.background_color;
                await AppDataSource.manager.save(accord);
                _accord = accord;
                console.log(`Create Accord: ${name}`);
            }
            // PerfumeNote
            const perfumeAccordExist = await AppDataSource.getRepository(
                PerfumeAccord,
            )
                .createQueryBuilder("pa")
                .where(`pa.perfume_id = ${perfume.id}`, {
                    perfume_id: perfume.id,
                })
                .andWhere(`pa.accord_id = ${_accord.id}`, {
                    accord_id: _accord.id,
                })
                .select(["id"])
                .execute();
            if (perfumeAccordExist?.length !== 1) {
                await AppDataSource.createQueryBuilder()
                    .insert()
                    .into(PerfumeAccord)
                    .values({
                        rate: properties.rate,
                        perfume,
                        accord: _accord,
                    })
                    .execute();
                console.log(
                    `Create PerfumeAccord: ${perfume.id} - ${_accord.id}`,
                );
            }
        }
        console.log(`Done Accord - perfume ${perfume.id}`);
        resolve();
    });
};

const getAccordProperties = (
    styleText: string,
): { color: string; background_color: string; rate: string } => {
    const res = { color: "", background_color: "", rate: "" };

    const _styleArr = styleText.split(";");
    const styleArr = _styleArr.filter(function (value) {
        return !value.includes("max-width");
    });
    styleArr.forEach(text => {
        const property = text.slice(0, text.indexOf(":")).trim();
        const value = text.slice(text.indexOf(":") + 1).trim();
        if (property === "color") res.color = value;
        else if (property === "background") res.background_color = value;
        else if (property === "width") res.rate = value.replace("%", "");
    });

    return res;
};
