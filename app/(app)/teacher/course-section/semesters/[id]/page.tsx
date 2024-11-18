import { CourseSectionTeachingInSemester } from "@/components/course-section/course-section-teaching-in-semester"

const courseSectionTeachingInSemester = ({params}: {params: {id: string}}) => {
    return <CourseSectionTeachingInSemester semesterId={params.id}/>
}

export default courseSectionTeachingInSemester