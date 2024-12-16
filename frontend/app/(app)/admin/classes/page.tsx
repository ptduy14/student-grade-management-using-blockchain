import { Classes } from "@/components/classes";
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Quản lí lớp học",
   description: "Student grade management",
}

const classes = () => {
    return <Classes />
}

export default classes;