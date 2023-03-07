import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class BrandId {
    @PrimaryColumn()
    _id: number;

    @Column()
    id: number;
}
