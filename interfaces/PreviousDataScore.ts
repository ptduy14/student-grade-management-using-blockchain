import { TransactionTypeEnum } from "@/components/course-section/course-section-with-student-and-score/enum/transaction-type-enum"

export interface PreviousDataScore {
    transaction_hash: string,
    course_section_id: number
    enrollment_pass_status: string,
    student_id: number,
    semester_id: number,
    score_id: number,
    midterm_score: number | null,
    final_score: number | null,
    total_score: number | null,
    transaction_type: TransactionTypeEnum;
}