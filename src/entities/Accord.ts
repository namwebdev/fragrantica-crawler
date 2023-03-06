import { Column, Entity, OneToMany } from "typeorm";
import { PerfumeAccord } from "./Perfume_Accord";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class Accord extends BaseModel {
    @Column()
    name: string;
    
    @Column()
    name_vn: string;

    @Column()
    image: string;

    @OneToMany(() => PerfumeAccord, perfume => perfume.perfume)
    perfumes: PerfumeAccord[];
}
