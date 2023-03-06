import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Note } from "./note";
import { Perfume } from "./Perfume";
import { BaseModel } from "./utils/BaseModel.entities";



@Entity()
export class PerfumeNote extends BaseModel {
    @Column()
    name: string;

    @Column()
    image: string;

    @ManyToOne(() => Perfume, perfume => perfume.notes)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;

    @ManyToOne(() => Note, note => note.perfumes)
    @JoinColumn({ name: "note_id" })
    note: Note;
}
