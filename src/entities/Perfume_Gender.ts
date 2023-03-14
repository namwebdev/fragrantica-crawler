import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Perfume } from "./Perfume";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class PerfumeGender extends BaseModel {
    @Column()
    female: string;

    @Column()
    unisex: string;

    @Column()
    male: string;

    @OneToOne(() => Perfume)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;
}
