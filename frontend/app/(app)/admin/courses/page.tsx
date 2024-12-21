import { Courses } from "@/components/courses";
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Quản lí môn học",
   description: "Student grade management",
}

const courses = () => {
    return <Courses />
}

export default courses;