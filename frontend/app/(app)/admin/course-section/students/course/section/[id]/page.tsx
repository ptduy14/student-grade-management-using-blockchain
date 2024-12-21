import { CourseSectionWithStudentAndScore } from "@/components/course-section/course-section-with-student-and-score"
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Lớp học phần",
   description: "Student grade management",
}

const courseSectionDetail = ({params}: {params: {id: string}}) => {
    return <CourseSectionWithStudentAndScore courseSectionId={params.id}/>
}

export default courseSectionDetail