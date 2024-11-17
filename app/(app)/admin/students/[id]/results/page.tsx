import { StudentResults } from "@/components/students/results"

const studentResults = ({params}: {params: {id: string}}) => {
    return <StudentResults studentId={params.id}/>
}

export default studentResults