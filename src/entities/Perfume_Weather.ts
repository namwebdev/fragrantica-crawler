import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import { Perfume } from "./Perfume";
import { BaseModel } from "./utils/BaseModel.entities";

@Entity()
export class PerfumeWeather extends BaseModel {
    @Column()
    spring: string;

    @Column()
    summer: string;

    @Column()
    fall: string;

    @Column()
    winter: string;

    @Column()
    day: string;

    @Column()
    night: string;

    @OneToOne(() => Perfume)
    @JoinColumn({ name: "perfume_id" })
    perfume: Perfume;
}
