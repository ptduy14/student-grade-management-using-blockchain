import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AcademicYear {
    @PrimaryGeneratedColumn()
    academic_year_id: number

    @Column()
    academic_year_start: number; // Năm bắt đầu (ví dụ: 2021)

    @Column()
    academic_year_end: number; // Năm kết thúc (ví dụ: 2022)

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // Thêm trường createdAt để lưu thời gian tạo
}
