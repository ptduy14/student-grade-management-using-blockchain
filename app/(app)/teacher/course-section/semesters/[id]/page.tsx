import { CourseSectionTeachingInSemester } from "@/components/course-section/course-section-teaching-in-semester"
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Lớp học phần giảng dạy",
   description: "Student grade management",
}


const courseSectionTeachingInSemester = ({params}: {params: {id: string}}) => {
    return <CourseSectionTeachingInSemester semesterId={params.id}/>
}

export default courseSectionTeachingInSemester