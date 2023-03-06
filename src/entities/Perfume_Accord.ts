import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Accord } from "./Accord";
import { Perfume } from "./Perfume";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class PerfumeAccord extends BaseModel {
    @Column()
    name: string;

    @Column()
    image: string;

    @ManyToOne(() => Perfume, perfume => perfume.accords)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;

    @ManyToOne(() => Accord, accord => accord.perfumes)
    @JoinColumn({ name: "accord_id" })
    accord: Accord;
}
