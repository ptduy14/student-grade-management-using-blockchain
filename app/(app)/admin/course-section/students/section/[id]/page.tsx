import { CourseSectionWithStudentAndScore } from "@/components/course-section/course-section-with-student-and-score"

const courseSectionDetail = ({params}: {params: {id: string}}) => {
    return <CourseSectionWithStudentAndScore courseSectionId={params.id}/>
}

export default courseSectionDetail