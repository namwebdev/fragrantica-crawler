import { Page } from "puppeteer";
import { AppDataSource } from "./../data-source";
import { PerfumeNote } from "./../entities/Perfume_Note";
import { Perfume } from "./../entities/Perfume";
import { Note } from "./../entities/Note";

export const notesCrawler = async (
    page: Page,
    perfume: Perfume,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        await page.waitForSelector("#pyramid", {
            visible: true,
        });
        const _notes = await page.$(
            "#pyramid > .cell > div > div:nth-of-type(2)",
        );
        if (!_notes || !_notes.$$) {
            reject("Cannot DOM Notes");
            return;
        }

        const notes = await _notes.$$(
            "div[style*='display: flex; justify-content: center; text-align: center; flex-flow: row wrap; align-items: flex-end; padding: 0.5rem;']",
        );
        if (notes.length <= 0 || notes.length > 3)
            reject("Error DOM notes (notes)");
        for (let i = 0; i < notes.length; i++) {
            const notesLine = await notes[i].$$("div[style*='margin: 0.2rem']");
            if (notesLine.length === 0) {
                reject("Error DOM notes (notesLine)");
                break;
            }

            let noteScentLayer: string;
            if (i === 0) noteScentLayer = "Top note";
            else if (i === 1) noteScentLayer = "Middle note";
            else if (i === 2) noteScentLayer = "Base note";
            for (let j = 0; j < notesLine.length; j++) {
                const _imgDOM = await notesLine[j].$(
                    "div:nth-of-type(1) > img",
                );
                const image = await _imgDOM.evaluate(e =>
                    e.getAttribute("src"),
                );
                if (!image) reject("Cannot DOM note image");

                const _nameDOM = await notesLine[j].$("div:nth-of-type(2)");
                const name = await _nameDOM.evaluate(e => e.textContent);
                if (!name) reject("Cannot DOM note image");

                let note = await AppDataSource.getRepository(Note).findOneBy({
                    name,
                });
                if (!note) {
                    const newNote = new Note();
                    newNote.name = name;
                    newNote.image = image;
                    await AppDataSource.manager.save(newNote);
                    note = newNote;
                    console.log(
                        `Create Note: ${note.name} - ${noteScentLayer}`,
                    );
                }
                // PerfumeNote
                const perfumeNoteExist: PerfumeNote[] =
                    await AppDataSource.getRepository(PerfumeNote)
                        .createQueryBuilder("pn")
                        .where(`pn.perfume_id = ${perfume.id}`, {
                            perfume_id: perfume.id,
                        })
                        .andWhere(`pn.note_id = ${note.id}`, {
                            note_id: note.id,
                        })
                        .select(["id"])
                        .execute();
                if (perfumeNoteExist?.length !== 1) {
                    await AppDataSource.createQueryBuilder()
                        .insert()
                        .into(PerfumeNote)
                        .values({
                            perfume,
                            note,
                            scent_layer: i,
                        })
                        .execute();
                    console.log(
                        `Create PerfumeNote: ${perfume.id} - ${note.id}`,
                    );
                }
            }
        }
        console.log(`Done Note - perfume ${perfume.id}`);
        resolve();
    });
};
