import { AcademicYear } from "@/components/academic-year"
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Năm học",
   description: "Student grade management",
}

const academicYears = ({params}: {params: {id: string}}) => {
    return <AcademicYear academicYearId={params.id}/>
}

export default academicYears