import { CourseSectionsInSemester } from "@/components/course-section/course-section-in-semester";
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Lớp học phần giảng dạy",
   description: "Student grade management",
}

const courseSectionInSemester = ({params}: {params: {id: string}}) => {
    return <CourseSectionsInSemester semesterId={params.id}/>
}

export default courseSectionInSemester;