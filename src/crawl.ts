import { BrandId } from "./entities/BrandId";
import { Perfume } from "./entities/Perfume";
import { AppDataSource } from "./data-source";
import puppeteer from "puppeteer";
import { Brand } from "./entities/Brand";

export const crawl = async (links: string[]) => {
    let targetUrl = links[0];
    const linkExist = (await AppDataSource.getRepository(Brand)
        .createQueryBuilder("brand")
        .select(["brand.source"])
        .getMany()) as any;
    if (linkExist) {
        const existLinks = linkExist.map(i => i.source);
        for (const link of links) {
            if (existLinks.includes(link)) {
                targetUrl = "";
                continue;
            }
            targetUrl = link;
            break;
        }
    }
    if (!targetUrl) return;
    return new Promise<void>(async (resolve, reject) => {
        try {
            const brand = new Brand();
            brand.source = targetUrl;

            const browser = await puppeteer.launch({
                headless: false,
                ignoreHTTPSErrors: true,
                defaultViewport: { width: 1920, height: 1080 },
            });
            const page = await browser.newPage();
            await page.goto(targetUrl, {
                waitUntil: "domcontentloaded",
            });

            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForSelector(".grid-x", {
                visible: true,
            });
            //
            let DOM = (await page.$(".cell.text-center.dname > h1")) as any;
            const name = await DOM.evaluate(el => el.textContent);
            if (!name) reject("Cannot DOM name");
            brand.name = name.replace(" perfumes and colognes", "");

            DOM = (await page.$(".cell.small-4.medium-12 > img")) as any;
            const image = await DOM.evaluate(el => el.getAttribute("src"));
            if (!image) reject("Cannot DOM image");
            brand.image = image;

            DOM = await page.$(
                ".cell.small-7.small-offset-1.medium-12 > a:nth-of-type(1) > b",
            );
            const country = await DOM.evaluate(el => el.textContent);
            if (!country) reject("Cannot DOM country");
            brand.country = country;

            DOM = await page.$(
                ".cell.small-7.small-offset-1.medium-12 > a:nth-of-type(3)",
            );
            if (DOM) {
                const link = await DOM.evaluate(el => el.getAttribute("href"));
                if (link) brand.link = link;
            }

            await page.waitForSelector(
                ".cell.text-left.prefumeHbox.px1-box-shadow",
                {
                    visible: true,
                },
            );
            const listPerfume = await page.$$(
                ".cell.text-left.prefumeHbox.px1-box-shadow",
            );
            if (!listPerfume || listPerfume.length === 0)
                reject("Cannot DOM listPerfume");
            const data = [];
            await AppDataSource.manager.save(brand);

            for (let i = 0; i < listPerfume.length; i++) {
                const perfume = {} as any;
                let perDOM = (await listPerfume[i].$("h3 > a")) as any;
                const perfumeName = await perDOM.evaluate(el => el.textContent);
                perfume.name = perfumeName;

                perDOM = await listPerfume[i].$("img:nth-of-type(1)");
                const perfumeImg = await perDOM.evaluate(el =>
                    el.getAttribute("src"),
                );
                perfume.image = perfumeImg;

                perDOM = await listPerfume[i].$(
                    ".flex-container.align-justify > span:nth-of-type(2)",
                );
                const perfumeYear = await perDOM.evaluate(el => el.textContent);
                if (perfumeYear && perfumeYear !== " ")
                    perfume.year = perfumeYear;
                perfume.brand = brand;
                data.push(perfume);
            }
            const res = data.map(i => AppDataSource.manager.create(Perfume, i));

            browser.close();
            await AppDataSource.manager.save(res);
            console.log(`Crawl success: ${res.length} - ${brand.name}`);

            resolve();
        } catch (err) {
            console.error(err);
        }
    });
};

export const crawlPerfumeLinks = async () => {
    let brandId = 1;
    const brand_id = await AppDataSource.getRepository(BrandId).findOne({
        where: {},
    });
    brandId = brand_id?.id || 1;
    const brand = await AppDataSource.getRepository(Brand)
        .createQueryBuilder("brand")
        .where({ id: brandId })
        .select(["brand.source"])
        .getOne();
    if (!brand?.source) {
        console.error("Cannot get brand");
        return;
    }
    const source = brand.source;

    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(source, {
        waitUntil: "networkidle2",
    });

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForSelector(".cell.text-left.prefumeHbox.px1-box-shadow", {
        visible: true,
    });
    const listPerfume = await page.$$(
        ".cell.text-left.prefumeHbox.px1-box-shadow",
    );
    if (!listPerfume || listPerfume.length === 0) {
        console.error("Cannot DOM list perfume");
        return;
    }

    let error = false;
    const promiseArr: Promise<void>[] = [];
    for (let i = 0; i < listPerfume.length; i++) {
        let perDOM = (await listPerfume[i].$("h3 > a")) as any;
        const link = await perDOM.evaluate(el => el.getAttribute("href"));
        const name = await perDOM.evaluate(el => el.textContent);
        perDOM = await listPerfume[i].$("img:nth-of-type(1)");
        const img = await perDOM.evaluate(el => el.getAttribute("src"));

        if (!(link && name && img)) {
            if (!link) console.error("Cannot DOM link perfume");
            if (!name) console.error("Cannot DOM name perfume");
            if (!img) console.error("Cannot DOM image perfume");
            error = true;
            break;
        }
        promiseArr.push(updatePerfumeLink(img, link, name));
    }
    browser.close();
    if (error) {
        console.error("Error");
        return;
    }
    await Promise.all(promiseArr);
    await AppDataSource.createQueryBuilder()
        .update(BrandId)
        .set({ id: brandId + 1 })
        .where({ id: brandId })
        .execute();
    console.log(`Success - ${brandId} - ${listPerfume.length}`);
};

const updatePerfumeLink = (
    image: string,
    link: string,
    name: string,
): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            await AppDataSource.createQueryBuilder()
                .update(Perfume)
                .set({
                    name: name.trim().replace("\n", ""),
                    link: `https://www.fragrantica.com${link}`,
                })
                .where({ image })
                .execute();
            console.log(name);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
