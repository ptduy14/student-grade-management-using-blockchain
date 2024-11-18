import { StudentResults } from "@/components/students/results"
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Kết quả học tập",
   description: "Student grade management",
}

const studentResults = ({params}: {params: {id: string}}) => {
    return <StudentResults studentId={params.id}/>
}

export default studentResults