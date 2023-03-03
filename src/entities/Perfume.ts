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

    @Column({ type: "varchar", nullable: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    image: string;

    @Column({ nullable: false, default: null })
    year: string;

    @ManyToOne(() => Brand, brand => brand.perfumes)
    @JoinColumn({ name: "brand_id" })
    brand: Brand;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
