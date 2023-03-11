import { Column, Entity, OneToMany } from "typeorm";
import { PerfumeNote } from "./Perfume_Note";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class Note extends BaseModel {
    @Column()
    name: string;

    @Column({ nullable: true, default: null })
    name_vn: string;

    @Column()
    image: string;

    @OneToMany(() => PerfumeNote, perfume => perfume.perfume)
    perfumes: PerfumeNote[];    
}
