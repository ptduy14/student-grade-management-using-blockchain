import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Class {
    @PrimaryGeneratedColumn()
    class_id: number

    @Column()
    class_display_name_id: string

    @Column()
    class_name: string
}
