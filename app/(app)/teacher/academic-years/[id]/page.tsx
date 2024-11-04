import { AcademicYear } from "@/components/academic-year"

const academicYears = ({params}: {params: {id: string}}) => {
    return <AcademicYear academicYearId={params.id}/>
}

export default academicYears