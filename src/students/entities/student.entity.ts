import { Class } from "src/classes/entities/class.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    student_id: number

    @Column({unique: true})
    student_code: string
    
    @Column()
    student_name: string

    @Column()
    student_email: string

    @Column()
    student_password: string

    @Column()
    student_phone: string

    @Column()
    student_address: string

    @ManyToOne(() => Class, (cls) => cls.students)
    class: Class
}
