interface ScoreSubmission {
    student_id: number;
    semester_id: number;
    course_section_id: number;
    score: number;
    score_type: "midterm" | "final"; // Nếu có nhiều loại điểm khác
  }
  