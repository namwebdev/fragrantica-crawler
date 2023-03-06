import { PerfumeAccord } from "./../entities/Perfume_Accord";
import { Perfume } from "./../entities/Perfume";
import { AppDataSource } from "./../data-source";

export const perfumeCrawler = async () => {
    let id = 1;
    const latestPerfumeAccord = await AppDataSource.getRepository(PerfumeAccord)
        .createQueryBuilder("perfume_accord")
        .orderBy({ id: "DESC" })
        .getOne();
    if (latestPerfumeAccord) {
        id = latestPerfumeAccord.perfume.id + 1;
    }
    const perfume = await AppDataSource.getRepository(Perfume)
        .createQueryBuilder("perfume")
        .where({ id }).select();
};

const crawl = async () => {
    try {
    } catch (err) {
        console.error(err);
    }
};
