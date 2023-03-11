import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "./utils/BaseModel.entities";
import { Note } from "./Note";
import { Perfume } from "./Perfume";

export enum note_scent_layers {
    top_note,
    middle_note,
    base_note,
}

export type NoteScentLayer = keyof typeof note_scent_layers;

@Entity()
export class PerfumeNote extends BaseModel {
    @Column()
    scent_layer: note_scent_layers;

    @ManyToOne(() => Perfume, perfume => perfume.notes)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;

    @ManyToOne(() => Note, note => note.perfumes)
    @JoinColumn({ name: "note_id" })
    note: Note;
}
