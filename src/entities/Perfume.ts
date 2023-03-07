import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Brand } from "./Brand";

@Entity()
export class Perfume {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    image: string;

    @Column({ default: null, nullable: true })
    year: string;

    @Column()
    link: string;

    @ManyToOne(() => Brand, brand => brand.perfumes)
    @JoinColumn({ name: "brand_id" })
    brand: Brand;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
