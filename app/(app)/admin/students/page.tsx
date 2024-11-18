import { ManageStudents } from "@/components/manage-students"
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Quản lí sinh viên",
   description: "Student grade management",
}

const students = () => {
    return <ManageStudents />
}

export default students;