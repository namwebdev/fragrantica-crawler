import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Perfume } from "./Perfume";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    image: string;

    @Column({ type: "varchar", nullable: true })
    country: string;

    @Column({ type: "varchar", nullable: true })
    link: string;

    @Column({ type: "varchar", nullable: true })
    source: string;

    @OneToMany(() => Perfume, perfume => perfume.brand)
    perfumes: Perfume[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
