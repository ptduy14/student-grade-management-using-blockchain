export interface PreviousDataScore {
    transaction_hash: string,
    course_section_id: number
    enrollment_pass_status: string,
    student_id: number,
    semester_id: number,
    score_id: number,
    midterm_score: number | null,
    final_score: number | null,
    total_score: number | null
}