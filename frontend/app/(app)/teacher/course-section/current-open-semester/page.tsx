import { CourseSectionTeachingInCurrentOpenSemester } from "@/components/course-section/course-section-teaching-in-current-semester";
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Lớp học phần giảng dạy",
   description: "Student grade management",
}

const courseSectionTeachingCurrentSemester = () => {
    return <CourseSectionTeachingInCurrentOpenSemester />
}

export default courseSectionTeachingCurrentSemester;