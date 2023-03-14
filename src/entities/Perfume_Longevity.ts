import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Perfume } from "./Perfume";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class PerfumeLongevity extends BaseModel {
    @Column()
    very_weak: string;

    @Column()
    weak: string;

    @Column()
    moderate: string;

    @Column()
    long_lasting: string;

    @Column()
    eternal: string;

    @OneToOne(() => Perfume)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;
}
