import { Column, Entity, OneToMany } from "typeorm";
import { PerfumeAccord } from "./Perfume_Accord";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class Accord extends BaseModel {
    @Column()
    name: string;

    @Column({ nullable: true, default: null })
    name_vn: string;

    @Column({ nullable: true, default: null })
    color: string;

    @Column({ nullable: true, default: null })
    background_color: string;

    @OneToMany(() => PerfumeAccord, perfume => perfume.perfume)
    perfumes: PerfumeAccord[];
}
