import { Column, Entity, OneToMany } from "typeorm";
import { PerfumeNote } from "./Perfume_Note";
import { BaseModel } from "./utils/BaseModel.entities";

export enum note_scent_layers {
    top_note,
    middle_note,
    base_note,
}

@Entity()
export class Note extends BaseModel {
    @Column()
    name: string;

    @Column()
    name_vn: string;

    @Column()
    scent_layer: note_scent_layers;

    @Column()
    image: string;

    @OneToMany(() => PerfumeNote, perfume => perfume.perfume)
    perfumes: PerfumeNote[];
}
