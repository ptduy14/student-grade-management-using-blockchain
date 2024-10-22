import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number

    @Column()
    course_display_name_id: string;

    @Column()
    course_name: string
    
    @Column()
    course_credits: number

    @Column()
    course_des: string
}
