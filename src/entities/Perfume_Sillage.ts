import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Perfume } from "./Perfume";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class PerfumeSillage extends BaseModel {
    @Column()
    intimate: string;

    @Column()
    moderate: string;

    @Column()
    strong: string;

    @Column()
    enormous: string;

    @OneToOne(() => Perfume)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;
}
